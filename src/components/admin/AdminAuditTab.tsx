import React from 'react';
import { AuditLog } from '../../types';

interface AdminAuditTabProps {
  auditLogs: AuditLog[];
}

export const AdminAuditTab: React.FC<AdminAuditTabProps> = ({ auditLogs }) => {
  return (
    <div className="rounded-3xl bg-white border border-slate-200/90 overflow-hidden space-y-2 shadow-xs">
      <div className="p-4 bg-[#faf7f2] border-b border-slate-200 flex items-center justify-between">
        <h3 className="font-extrabold text-slate-900 text-sm">System Audit Trail ({auditLogs.length} Records)</h3>
        <span className="text-xs text-slate-500 font-mono">Immutable chronological event log</span>
      </div>

      <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
        {auditLogs.map((log) => (
          <div key={log.id} className="p-3.5 px-4 text-xs font-mono space-y-1 hover:bg-[#faf7f2]/60">
            <div className="flex items-center justify-between text-slate-500">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-orange-100 text-orange-800 font-bold border border-orange-200">
                  {log.action}
                </span>
                {log.teamId && <span className="text-blue-700 font-bold">[{log.teamId}]</span>}
                <span className="text-slate-500 font-sans">by {log.actor}</span>
              </div>
              <span className="text-slate-400 text-[11px]">{log.timestamp}</span>
            </div>
            <p className="text-slate-700 font-sans text-xs pt-0.5">{log.details}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
