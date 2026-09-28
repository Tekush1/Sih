import React, { useState } from 'react';
import { TeamTrack } from '../../types';
import { X, Search } from 'lucide-react';

interface AdminInsertTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSIHModal: () => void;
  onInsert: (data: {
    name: string;
    college: string;
    psId: string;
    problemStatement: string;
    track: TeamTrack;
    googleDriveFolder: string;
    position: 'top' | 'next' | 'end';
    sendImmediately: boolean;
  }) => void;
  newPSId: string;
  newProblemStatement: string;
}

export const AdminInsertTeamModal: React.FC<AdminInsertTeamModalProps> = ({
  isOpen,
  onClose,
  onOpenSIHModal,
  onInsert,
  newPSId,
  newProblemStatement
}) => {
  const [teamName, setTeamName] = useState<string>('');
  const [driveLink, setDriveLink] = useState<string>('');
  const [college, setCollege] = useState<string>('Technocrats Institute of Technology (TIT), Bhopal');
  const [track, setTrack] = useState<TeamTrack>('AI & Robotics');
  const [position, setPosition] = useState<'top' | 'next' | 'end'>('next');
  const [sendImmediately, setSendImmediately] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName.trim()) {
      alert('Please enter a team name');
      return;
    }
    onInsert({
      name: teamName.trim(),
      college: college.trim(),
      psId: newPSId.trim(),
      problemStatement: newProblemStatement.trim() || 'Smart India Hackathon 2026 Project',
      track,
      googleDriveFolder: driveLink.trim(),
      position,
      sendImmediately
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-xl w-full shadow-2xl p-6 md:p-8 space-y-6 text-slate-800">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-xl font-bold text-slate-900">Insert Squad into Lineup</h3>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-800 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Squad / Team Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. TIT Quantum Innovators"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#faf7f2] border border-slate-200 text-sm focus:outline-none focus:border-orange-500 font-sans"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Google Drive Presentation URL</label>
            <input
              type="url"
              placeholder="https://drive.google.com/..."
              value={driveLink}
              onChange={(e) => setDriveLink(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#faf7f2] border border-slate-200 text-xs font-mono focus:outline-none focus:border-orange-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">SIH PS ID</label>
              <div className="flex gap-1.5">
                <input
                  type="text"
                  value={newPSId}
                  readOnly
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 border border-slate-200 text-orange-700 font-mono font-bold"
                />
                <button
                  type="button"
                  onClick={onOpenSIHModal}
                  className="px-2.5 rounded-xl bg-orange-100 hover:bg-orange-200 text-orange-800 cursor-pointer"
                >
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Track</label>
              <select
                value={track}
                onChange={(e) => setTrack(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-[#faf7f2] border border-slate-200"
              >
                <option value="AI & Robotics">AI &amp; Robotics</option>
                <option value="Web3 & Cloud">Web3 &amp; Cloud</option>
                <option value="HealthTech & Bio">HealthTech &amp; Bio</option>
                <option value="Smart Cities & IoT">Smart Cities &amp; IoT</option>
              </select>
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold">
              Cancel
            </button>
            <button type="submit" className="px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold cursor-pointer">
              Insert into Line
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
