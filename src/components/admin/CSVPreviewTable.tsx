import React from 'react';
import { CSVTeamRecord } from '../../types';
import { RefreshCw, ExternalLink } from 'lucide-react';

interface CSVPreviewTableProps {
  parsedRecords: CSVTeamRecord[];
  existingTeamNamesSet: Set<string>;
  onReset: () => void;
}

export const CSVPreviewTable: React.FC<CSVPreviewTableProps> = ({
  parsedRecords,
  existingTeamNamesSet,
  onReset
}) => {
  if (parsedRecords.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-slate-700">PARSED SQUADS PREVIEW</span>
          <span className="px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 text-[10px] font-mono font-bold">
            {parsedRecords.length} squads ready
          </span>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="text-xs font-mono text-slate-400 hover:text-slate-700 flex items-center gap-1 cursor-pointer"
        >
          <RefreshCw className="w-3 h-3" />
          <span>Clear</span>
        </button>
      </div>

      <div className="border border-slate-200 rounded-2xl overflow-hidden max-h-56 overflow-y-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#faf7f2] border-b border-slate-200 text-slate-600 font-mono text-[11px] sticky top-0">
            <tr>
              <th className="py-2.5 px-3 font-bold">#</th>
              <th className="py-2.5 px-3 font-bold">Team Name</th>
              <th className="py-2.5 px-3 font-bold">Track</th>
              <th className="py-2.5 px-3 font-bold">Google Drive Link</th>
              <th className="py-2.5 px-3 font-bold">Lineup Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-sans">
            {parsedRecords.map((record, idx) => {
              const isExisting = existingTeamNamesSet.has(record.teamName.trim().toLowerCase());
              return (
                <tr key={idx} className="hover:bg-orange-50/40 transition-colors">
                  <td className="py-2 px-3 font-mono text-slate-400">{idx + 1}</td>
                  <td className="py-2 px-3 font-bold text-slate-900">{record.teamName}</td>
                  <td className="py-2 px-3">
                    <span className="px-2 py-0.5 rounded-md font-mono text-[10px] font-bold bg-blue-100 text-blue-800">
                      {record.track}
                    </span>
                  </td>
                  <td className="py-2 px-3 font-mono text-[11px] max-w-[200px] truncate">
                    {record.googleDriveLink ? (
                      <a
                        href={record.googleDriveLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline inline-flex items-center gap-1"
                      >
                        <span className="truncate">{record.googleDriveLink}</span>
                        <ExternalLink className="w-3 h-3 shrink-0" />
                      </a>
                    ) : (
                      <span className="text-slate-400 italic">No link specified</span>
                    )}
                  </td>
                  <td className="py-2 px-3">
                    {isExisting ? (
                      <span className="px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 font-mono text-[10px] font-bold">
                        UPDATE EXISTING
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-mono text-[10px] font-bold">
                        + NEW SQUAD
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
