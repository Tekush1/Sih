import React, { useState } from 'react';
import { Team } from '../../types';
import { X, Check } from 'lucide-react';

interface AdminEditSlideModalProps {
  editingTeam: Team | null;
  onClose: () => void;
  onSaveSlide: (teamId: string, slideIndex: number, data: { title: string; bulletPoints: string[] }) => void;
}

export const AdminEditSlideModal: React.FC<AdminEditSlideModalProps> = ({
  editingTeam,
  onClose,
  onSaveSlide
}) => {
  const [slideIdx, setSlideIdx] = useState<number>(0);
  const [title, setTitle] = useState<string>('');
  const [b1, setB1] = useState<string>('');
  const [b2, setB2] = useState<string>('');
  const [b3, setB3] = useState<string>('');

  if (!editingTeam) return null;

  const handleSelectSlide = (idx: number) => {
    setSlideIdx(idx);
    const s = editingTeam.submission?.slides?.[idx];
    if (s) {
      setTitle(s.title || '');
      setB1(s.bulletPoints?.[0] || '');
      setB2(s.bulletPoints?.[1] || '');
      setB3(s.bulletPoints?.[2] || '');
    }
  };

  const handleSave = () => {
    const bullets = [b1, b2, b3].filter((b) => b.trim() !== '');
    onSaveSlide(editingTeam.id, slideIdx, {
      title: title.trim() || `Slide 0${slideIdx + 1}`,
      bulletPoints: bullets.length > 0 ? bullets : ['Key point verified']
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="max-w-xl w-full bg-white border border-slate-200 rounded-3xl p-6 space-y-5 text-slate-800 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="font-extrabold text-slate-900 text-base">
            Edit Slides: {editingTeam.name} ({editingTeam.id})
          </h3>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-800 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-1.5 pb-2">
          {[0, 1, 2, 3, 4, 5].map((idx) => (
            <button
              key={idx}
              onClick={() => handleSelectSlide(idx)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold cursor-pointer ${
                slideIdx === idx ? 'bg-orange-600 text-white' : 'bg-slate-100 text-slate-700'
              }`}
            >
              Slide 0{idx + 1}
            </button>
          ))}
        </div>

        <div className="space-y-3 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Slide Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#faf7f2] border border-slate-200"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Bullet Point 1</label>
            <input
              type="text"
              value={b1}
              onChange={(e) => setB1(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#faf7f2] border border-slate-200"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Bullet Point 2</label>
            <input
              type="text"
              value={b2}
              onChange={(e) => setB2(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#faf7f2] border border-slate-200"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
          <button onClick={onClose} className="px-4 py-2 rounded-xl bg-slate-100 text-xs font-bold text-slate-700">
            Cancel
          </button>
          <button onClick={handleSave} className="px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-xs font-bold text-white flex items-center gap-1.5 cursor-pointer">
            <Check className="w-4 h-4" />
            <span>Save Slide</span>
          </button>
        </div>
      </div>
    </div>
  );
};
