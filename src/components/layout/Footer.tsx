import React from 'react';
import { ArrowUp } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-slate-200 bg-white text-slate-600 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand & Tagline */}
        <div className="space-y-1 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <span className="w-2 h-2 rounded-full bg-orange-500" />
            <span className="text-base font-extrabold text-slate-900 tracking-tight">
              TIT Excellence Incubation Cell
            </span>
            <span className="text-xs font-mono font-bold text-orange-600">· Smart Hackathon 2026</span>
          </div>
          <p className="text-xs text-slate-500">
            Technocrats Institute of Technology, Bhopal · Internal Hackathon for Smart India Hackathon (SIH 2026) Nomination.
          </p>
        </div>

        {/* Links */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-bold text-slate-600">
          <button onClick={() => onNavigate('home')} className="hover:text-orange-600 transition-colors cursor-pointer">
            Pitch Hub
          </button>
          <button onClick={() => onNavigate('stage-portal')} className="hover:text-orange-600 transition-colors cursor-pointer">
            Stage Arenas
          </button>
          <button onClick={() => onNavigate('teams')} className="hover:text-orange-600 transition-colors cursor-pointer">
            Pitch Decks &amp; PS IDs
          </button>
          <button onClick={() => onNavigate('schedule')} className="hover:text-orange-600 transition-colors cursor-pointer">
            6-Min Schedule
          </button>
          <button onClick={() => onNavigate('admin')} className="hover:text-orange-600 transition-colors cursor-pointer">
            Admin Line Portal
          </button>
          <button onClick={() => onNavigate('screen')} className="hover:text-orange-600 transition-colors cursor-pointer">
            Projector Screen
          </button>
          <button onClick={() => onNavigate('team-portal')} className="hover:text-orange-600 transition-colors cursor-pointer">
            Presenter Rehearsal
          </button>
        </div>

        {/* Right: Back to top & copyright */}
        <div className="flex items-center gap-4 text-xs font-mono text-slate-500">
          <span>© 2026 TIT Incubation Cell</span>
          <button
            onClick={scrollToTop}
            className="p-2 rounded-lg bg-orange-50 border border-orange-200 text-orange-600 hover:bg-orange-100 transition-colors cursor-pointer"
            title="Back to top"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    </footer>
  );
};
