import React from 'react';
import { Team } from '../../types';
import { Eye, Check, CheckCircle2 } from 'lucide-react';

interface AdminApprovalsTabProps {
  pendingSubmissions: Team[];
  approvedSubmissions: Team[];
  onOpenReview: (team: Team) => void;
  onInstantApprove: (teamId: string) => void;
  onOpenQR: (team: Team) => void;
}

export const AdminApprovalsTab: React.FC<AdminApprovalsTabProps> = ({
  pendingSubmissions,
  approvedSubmissions,
  onOpenReview,
  onInstantApprove,
  onOpenQR
}) => {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white border border-slate-200/90 overflow-hidden shadow-xs">
        <div className="p-4 bg-[#faf7f2] border-b border-slate-200 flex items-center justify-between">
          <h3 className="font-extrabold text-slate-900 text-sm">
            Submissions Awaiting Admin Review ({pendingSubmissions.length})
          </h3>
          <span className="text-xs text-orange-700 font-mono font-bold">
            Approved PPTs automatically unlock Digital QR Passes
          </span>
        </div>

        {pendingSubmissions.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500 font-mono">
            All uploaded presentation submissions have been reviewed and approved!
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {pendingSubmissions.map((team) => (
              <div key={team.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-orange-100 border border-orange-200 text-orange-800 font-mono text-xs font-bold">
                      {team.id}
                    </span>
                    <h4 className="font-extrabold text-slate-900 text-sm">{team.name}</h4>
                    <span className="text-xs text-slate-500">· {team.college}</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-mono font-bold">
                      PS: {team.psId || 'SIH1609'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">
                    File: <span className="font-mono text-slate-900 font-bold">{team.submission?.fileName}</span> ({team.submission?.fileSize}) · <span className="text-orange-700 font-medium">{team.track}</span>
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => onOpenReview(team)}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Review Deck</span>
                  </button>

                  <button
                    onClick={() => onInstantApprove(team.id)}
                    className="px-3.5 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer shadow-xs"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Instant Approve</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="rounded-3xl bg-white border border-slate-200/90 overflow-hidden shadow-xs">
        <div className="p-4 bg-[#faf7f2] border-b border-slate-200 flex items-center justify-between">
          <h4 className="font-bold text-xs font-mono uppercase text-slate-600">
            Recently Approved Presentations ({approvedSubmissions.length})
          </h4>
        </div>
        <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
          {approvedSubmissions.slice(0, 10).map((team) => (
            <div key={team.id} className="p-3 px-4 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <span className="font-mono text-orange-700 font-bold">{team.id}</span>
                <span className="text-slate-900 font-bold">{team.name}</span>
                <span className="text-slate-500 truncate max-w-xs">{team.college}</span>
                <span className="font-mono text-xs text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                  {team.psId || 'SIH1609'}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-emerald-700 font-mono text-[11px] font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" /> PASS ACTIVE
                </span>
                <button
                  onClick={() => onOpenQR(team)}
                  className="text-orange-600 hover:underline font-mono text-[11px] font-bold cursor-pointer"
                >
                  View QR Pass
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
