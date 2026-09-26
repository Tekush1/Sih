import React from 'react';
import { TeamTrack } from '../../types';
import { ArrowRight, Cpu, Cloud, Globe, HeartPulse } from 'lucide-react';

interface TracksSectionProps {
  onSelectTrack: (track: TeamTrack) => void;
}

const TRACKS_METADATA = [
  {
    track: 'AI & Robotics' as TeamTrack,
    title: 'Autonomous Systems & Edge AI',
    description: 'Autonomous drones, real-time surgical computer vision, micro-robotics, and quantized on-device neural edge models.',
    image: '/src/assets/images/track_ai_robotics_1790364310063.jpg',
    stage: 'Stage Alpha',
    location: 'Auditorium Hall A · TIT Campus',
    prizePool: '₹1,00,000',
    teamsCount: 32,
    icon: Cpu
  },
  {
    track: 'Web3 & Cloud' as TeamTrack,
    title: 'Decentralized Networks & Cloud',
    description: 'Zero-knowledge verification protocols, resilient cloud storage shards, distributed ledger telemetry, and sovereign P2P systems.',
    image: '/src/assets/images/track_web3_cloud_1790364321638.jpg',
    stage: 'Stage Beta',
    location: 'Sir C.V. Raman Hall · TIT Campus',
    prizePool: '₹1,00,000',
    teamsCount: 32,
    icon: Cloud
  },
  {
    track: 'Smart Cities & IoT' as TeamTrack,
    title: 'Urban Grid & Resilient Infrastructure',
    description: 'Sub-second adaptive urban traffic synchronization, decentralized microgrid controllers, and municipal IoT telemetry.',
    image: '/src/assets/images/track_smart_cities_1790364333443.jpg',
    stage: 'Stage Delta',
    location: 'Swami Vivekananda Arena · TIT Campus',
    prizePool: '₹75,000',
    teamsCount: 32,
    icon: Globe
  },
  {
    track: 'HealthTech & Bio' as TeamTrack,
    title: 'Bioinformatics & Precision Health',
    description: 'Medical image spectroscopic classifiers, continuous ICU hemodynamic forecasting, and closed-loop remote bio-telemetry.',
    image: '/src/assets/images/track_health_biotech_1790364345229.jpg',
    stage: 'Stage Gamma',
    location: 'Dr. APJ Kalam Center · TIT Campus',
    prizePool: '₹75,000',
    teamsCount: 32,
    icon: HeartPulse
  }
];

export const TracksSection: React.FC<TracksSectionProps> = ({ onSelectTrack }) => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-orange-600 block mb-2">
            01. INNOVATION TRACKS &amp; SIH THEMES
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0f172a] tracking-tight">
            Four Arenas of Radical Impact
          </h2>
        </div>
        <p className="text-sm text-slate-600 max-w-md">
          Each track features a dedicated stage arena on the TIT Bhopal campus, synchronized 6-minute presentation schedules, and specialized faculty judging panels.
        </p>
      </div>

      {/* 4 Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {TRACKS_METADATA.map((t) => {
          const Icon = t.icon;
          return (
            <div
              key={t.track}
              className="group relative rounded-3xl bg-white border border-slate-200/90 hover:border-orange-400 hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col justify-between shadow-xs"
            >
              {/* Image banner with measured contrast scrim */}
              <div className="relative h-56 w-full overflow-hidden">
                <img
                  src={t.image}
                  alt={t.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 filter brightness-95"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                {/* Stage Tag */}
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-white/90 border border-slate-200 text-slate-800 font-mono text-xs font-bold backdrop-blur-md shadow-xs">
                    {t.stage}
                  </span>
                  <span className="text-white text-xs font-medium drop-shadow-sm">
                    {t.location.split('·')[0].trim()}
                  </span>
                </div>

                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1 rounded-full bg-orange-600 text-white font-mono text-xs font-bold backdrop-blur-md shadow-sm">
                    Award: {t.prizePool}
                  </span>
                </div>
              </div>

              {/* Body Content */}
              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono text-slate-500 mb-2">
                    <Icon className="w-4 h-4 text-orange-600" />
                    <span className="font-bold text-orange-600">{t.track}</span>
                    <span className="text-slate-300">·</span>
                    <span>{t.teamsCount} Seeded Teams</span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-orange-600 transition-colors">
                    {t.title}
                  </h3>

                  <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                    {t.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-500">
                    Format: 6-Slide Live Demonstration
                  </span>

                  <button
                    onClick={() => onSelectTrack(t.track)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 hover:text-orange-700 transition-colors cursor-pointer"
                  >
                    <span>View Track Teams</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
