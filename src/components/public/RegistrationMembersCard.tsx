import React from 'react';
import { User, Users } from 'lucide-react';

interface RegistrationMembersCardProps {
  leaderName: string;
  setLeaderName: (val: string) => void;
  leaderEmail: string;
  setLeaderEmail: (val: string) => void;
  leaderPhone: string;
  setLeaderPhone: (val: string) => void;
  m2Name: string;
  setM2Name: (val: string) => void;
  m2Email: string;
  setM2Email: (val: string) => void;
  m3Name: string;
  setM3Name: (val: string) => void;
  m3Email: string;
  setM3Email: (val: string) => void;
  m4Name: string;
  setM4Name: (val: string) => void;
  m4Email: string;
  setM4Email: (val: string) => void;
}

export const RegistrationMembersCard: React.FC<RegistrationMembersCardProps> = ({
  leaderName,
  setLeaderName,
  leaderEmail,
  setLeaderEmail,
  leaderPhone,
  setLeaderPhone,
  m2Name,
  setM2Name,
  m2Email,
  setM2Email,
  m3Name,
  setM3Name,
  m3Email,
  setM3Email,
  m4Name,
  setM4Name,
  m4Email,
  setM4Email
}) => {
  return (
    <div className="p-6 md:p-8 rounded-3xl bg-white border border-slate-200/90 space-y-6 shadow-xs">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Users className="w-5 h-5 text-orange-600" />
          <span>Team Leader &amp; Members</span>
        </h3>
        <span className="text-xs font-mono text-slate-500">4-6 Members per SIH rules</span>
      </div>

      {/* Leader */}
      <div className="p-4 rounded-2xl bg-orange-50/60 border border-orange-200 space-y-3">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-orange-700">
          <User className="w-4 h-4" />
          <span>TEAM LEADER (PRIMARY POINT OF CONTACT)</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input
            type="text"
            required
            placeholder="Leader Full Name *"
            value={leaderName}
            onChange={(e) => setLeaderName(e.target.value)}
            className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs"
          />
          <input
            type="email"
            required
            placeholder="Leader Email *"
            value={leaderEmail}
            onChange={(e) => setLeaderEmail(e.target.value)}
            className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs"
          />
          <input
            type="tel"
            required
            placeholder="Phone Number *"
            value={leaderPhone}
            onChange={(e) => setLeaderPhone(e.target.value)}
            className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs"
          />
        </div>
      </div>

      {/* Members 2, 3, 4 */}
      <div className="space-y-3">
        <span className="text-xs font-mono font-bold text-slate-500">ADDITIONAL TEAM MEMBERS</span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            type="text"
            placeholder="Member 2 Name"
            value={m2Name}
            onChange={(e) => setM2Name(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[#faf7f2] border border-slate-200 text-xs"
          />
          <input
            type="email"
            placeholder="Member 2 Email"
            value={m2Email}
            onChange={(e) => setM2Email(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[#faf7f2] border border-slate-200 text-xs"
          />
          <input
            type="text"
            placeholder="Member 3 Name"
            value={m3Name}
            onChange={(e) => setM3Name(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[#faf7f2] border border-slate-200 text-xs"
          />
          <input
            type="email"
            placeholder="Member 3 Email"
            value={m3Email}
            onChange={(e) => setM3Email(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[#faf7f2] border border-slate-200 text-xs"
          />
          <input
            type="text"
            placeholder="Member 4 Name"
            value={m4Name}
            onChange={(e) => setM4Name(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[#faf7f2] border border-slate-200 text-xs"
          />
          <input
            type="email"
            placeholder="Member 4 Email"
            value={m4Email}
            onChange={(e) => setM4Email(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[#faf7f2] border border-slate-200 text-xs"
          />
        </div>
      </div>
    </div>
  );
};
