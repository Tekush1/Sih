import React from 'react';

interface FooterProps {
  onNavigate: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="border-t border-slate-200 bg-white text-slate-600 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-500">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-orange-500" />
          <span className="font-bold text-slate-900">Smart Hackathon 2026</span>
          <span>·</span>
          <span>Technocrats Institute of Technology (TIT), Bhopal</span>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => onNavigate('admin')}
            className="hover:text-orange-600 transition-colors cursor-pointer font-bold"
          >
            Standings &amp; Lineup
          </button>
          <span>·</span>
          <button
            onClick={() => onNavigate('screen')}
            className="hover:text-orange-600 transition-colors cursor-pointer font-bold"
          >
            Live on Auditorium
          </button>
        </div>
      </div>
    </footer>
  );
};
