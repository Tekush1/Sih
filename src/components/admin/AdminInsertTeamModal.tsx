import React, { useState, useRef } from 'react';
import { TeamTrack } from '../../types';
import { X, Search, UploadCloud, FileText, Check, HardDrive } from 'lucide-react';

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
    localFile?: File;
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
  const [localFile, setLocalFile] = useState<File | null>(null);
  const [college, setCollege] = useState<string>('Technocrats Institute of Technology (TIT), Bhopal');
  const [track, setTrack] = useState<TeamTrack>('AI & Robotics');
  const [position, setPosition] = useState<'top' | 'next' | 'end'>('next');
  const [sendImmediately, setSendImmediately] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      localFile: localFile || undefined,
      position,
      sendImmediately
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-xl w-full shadow-2xl p-6 md:p-8 space-y-5 text-slate-800 my-8">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-orange-100 text-orange-800 font-bold">
              Manual Lineup Insertion
            </span>
            <h3 className="text-xl font-bold text-slate-900 mt-1">Insert Squad into Lineup</h3>
          </div>
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
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf7f2] border border-slate-200 text-sm focus:outline-none focus:border-orange-500 font-sans"
            />
          </div>

          {/* Local PPT/PDF File Attachment Section */}
          <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-bold text-emerald-950 flex items-center gap-1.5 text-xs">
                <HardDrive className="w-4 h-4 text-emerald-600" />
                <span>Local PPT / PDF Presentation File (Offline)</span>
              </label>
              {localFile && (
                <button
                  type="button"
                  onClick={() => setLocalFile(null)}
                  className="text-[10px] text-rose-600 hover:underline font-mono"
                >
                  Remove
                </button>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.pptx,application/pdf"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) setLocalFile(f);
              }}
              className="hidden"
            />

            {!localFile ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const f = e.dataTransfer.files?.[0];
                  if (f) setLocalFile(f);
                }}
                className="p-3 border border-dashed border-emerald-400 rounded-xl bg-white hover:bg-emerald-50/50 cursor-pointer text-center transition-colors space-y-1"
              >
                <UploadCloud className="w-5 h-5 text-emerald-600 mx-auto" />
                <p className="text-[11px] font-bold text-emerald-900">
                  Click to choose local PPTX or PDF file (Zero Internet)
                </p>
                <p className="text-[10px] text-slate-500 font-mono">
                  Stored directly on this machine for offline presentation
                </p>
              </div>
            ) : (
              <div className="p-2.5 rounded-xl bg-white border border-emerald-300 flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate">{localFile.name}</p>
                    <p className="text-[10px] font-mono text-slate-500">
                      {(localFile.size / (1024 * 1024)).toFixed(2)} MB · Ready for Offline Presentation
                    </p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold flex items-center gap-1 shrink-0">
                  <Check className="w-3 h-3" />
                  <span>Attached</span>
                </span>
              </div>
            )}
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Google Drive URL <span className="font-normal text-slate-500 text-[10px]">(Optional if local file provided)</span>
            </label>
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
                  title="Lookup SIH Problem Statement"
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
                className="w-full px-3 py-2 rounded-xl bg-[#faf7f2] border border-slate-200 text-xs font-bold"
              >
                <option value="AI & Robotics">AI &amp; Robotics</option>
                <option value="Web3 & Cloud">Web3 &amp; Cloud</option>
                <option value="HealthTech & Bio">HealthTech &amp; Bio</option>
                <option value="Smart Cities & IoT">Smart Cities &amp; IoT</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Line Position</label>
              <select
                value={position}
                onChange={(e) => setPosition(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-[#faf7f2] border border-slate-200 text-xs"
              >
                <option value="next">Next Up (Directly after current)</option>
                <option value="top">Top of Queue</option>
                <option value="end">End of Queue</option>
              </select>
            </div>

            <div className="flex items-center gap-2 pt-5">
              <input
                id="sendImmediately"
                type="checkbox"
                checked={sendImmediately}
                onChange={(e) => setSendImmediately(e.target.checked)}
                className="w-4 h-4 text-orange-600 rounded cursor-pointer"
              />
              <label htmlFor="sendImmediately" className="font-bold text-slate-700 cursor-pointer select-none">
                Present on Screen Immediately
              </label>
            </div>
          </div>

          <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
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
