import React, { useState } from 'react';
import { useHackathon } from '../../context/HackathonContext';
import { UserRole } from '../../types';
import { 
  Menu, 
  X, 
  ChevronDown,
  Layers,
  Sparkles,
  ShieldCheck,
  Play,
  Sliders,
  Tv,
  Users,
  FileSpreadsheet
} from 'lucide-react';
import { InstitutionalHeader } from './InstitutionalHeader';

interface NavbarProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
  onLaunchLivePitch?: () => void;
  onOpenCSVUpload?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onNavigate, onLaunchLivePitch, onOpenCSVUpload }) => {
  const { role, setRole } = useHackathon();
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState<boolean>(false);

  // The core portals: Admin Portal, Screen Portal, Stage, Teams, Schedule, Vault
  const navLinks = [
    { id: 'admin', label: '⚙️ ADMIN LINE PORTAL' },
    { id: 'screen', label: '🖥️ SCREEN PORTAL (PROJECTOR)' },
    { id: 'home', label: 'STAGE OVERVIEW' },
    { id: 'teams', label: 'TEAM DECKS' },
    { id: 'schedule', label: '6-MIN CADENCE' },
    { id: 'team-portal', label: 'REHEARSAL VAULT' }
  ];

  return (
    <header className="sticky top-0 z-40 w-full shadow-xs bg-white">
      {/* Top Institutional Header with Indian Ministry & TIT Logos */}
      <InstitutionalHeader
        onAdminClick={() => onNavigate('admin')}
        onScreenClick={() => onNavigate('screen')}
      />

      {/* Primary Sub-Navigation Bar */}
      <div className="border-b border-slate-200 bg-white/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          {/* Brand Wordmark */}
          <button
            onClick={() => onNavigate('admin')}
            className="flex items-center gap-2 text-left group transition-opacity cursor-pointer shrink-0"
          >
            <div className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse" />
            <div className="flex flex-col">
              <span className="text-sm font-extrabold tracking-tight text-slate-900 group-hover:text-orange-600 transition-colors uppercase">
                TIT Incubation Cell
              </span>
              <span className="text-[10px] font-bold text-orange-600 tracking-wider -mt-0.5">
                SMART HACKATHON 2026 · STAGE &amp; SCREEN
              </span>
            </div>
          </button>

          {/* Navigation Links */}
          <nav className="hidden xl:flex items-center gap-4 2xl:gap-5 text-xs font-bold tracking-wider text-slate-700">
            {navLinks.map((item) => {
              const isActive = currentTab === item.id;
              const isSpecial = item.id === 'admin' || item.id === 'screen';
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`py-2 px-1 transition-all relative cursor-pointer ${
                    isActive
                      ? 'text-orange-600 font-black'
                      : isSpecial
                      ? 'text-slate-900 font-extrabold hover:text-orange-600'
                      : 'hover:text-orange-600 text-slate-600 font-medium'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action: Quick Switch between Admin & Screen */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => {
                if (onOpenCSVUpload) {
                  onOpenCSVUpload();
                } else {
                  onNavigate('admin');
                }
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-xs font-bold text-white transition-colors cursor-pointer shadow-xs"
              title="Insert squads from CSV file"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Insert CSV</span>
            </button>

            <button
              onClick={() => onNavigate(currentTab === 'screen' ? 'admin' : 'screen')}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-orange-100/80 border border-orange-200 text-xs font-bold text-orange-800 hover:bg-orange-200 transition-colors cursor-pointer"
            >
              {currentTab === 'screen' ? (
                <>
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Go to Admin Line</span>
                </>
              ) : (
                <>
                  <Tv className="w-3.5 h-3.5" />
                  <span>Go to Projector Screen</span>
                </>
              )}
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen((o) => !o)}
              className="xl:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="xl:hidden border-t border-slate-200 bg-white p-4 space-y-2">
            {navLinks.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left py-2 px-3 rounded-xl text-xs font-bold transition-colors ${
                  currentTab === item.id
                    ? 'bg-orange-50 text-orange-600 font-black'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
};
