import React from 'react';
import { RefreshCw, CheckCircle2, ExternalLink } from 'lucide-react';

interface RegistrationSheetsSyncViewProps {
  isSyncing: boolean;
  onSync: () => void;
  teamsCount: number;
}

export const RegistrationSheetsSyncView: React.FC<RegistrationSheetsSyncViewProps> = ({
  isSyncing,
  onSync,
  teamsCount
}) => {
  return (
    <div className="max-w-2xl mx-auto p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-emerald-100 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto">
        <CheckCircle2 className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <h3 className="text-2xl font-black text-slate-900">Google Sheets Bi-Directional Sync</h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
          Google Forms responses are mirrored automatically to your official spreadsheet and synced to our local Hackathon context.
        </p>
      </div>

      <div className="p-4 rounded-2xl bg-[#faf7f2] border border-slate-200 text-xs font-mono text-left space-y-1">
        <div className="flex justify-between">
          <span className="text-slate-500">Spreadsheet Name:</span>
          <span className="font-bold text-slate-800">TIT_SIH_2026_Registrations</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">Connected Rows:</span>
          <span className="font-bold text-orange-600">{teamsCount} Teams</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">Auto-Polling:</span>
          <span className="font-bold text-emerald-600">Active (5s Interval)</span>
        </div>
      </div>

      <button
        onClick={onSync}
        disabled={isSyncing}
        className="px-6 py-3 rounded-2xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs flex items-center justify-center gap-2 mx-auto cursor-pointer shadow-md"
      >
        <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
        <span>{isSyncing ? 'Syncing...' : 'Force Manual Sync Now'}</span>
      </button>
    </div>
  );
};
