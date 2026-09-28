import React, { useState } from 'react';
import { useHackathon } from '../../context/HackathonContext';
import { CSVTeamRecord } from '../../types';
import { parseTeamsCSV, getSampleCSVContent } from '../../utils/csvParser';
import { X, FileSpreadsheet } from 'lucide-react';
import { CSVPreviewTable } from './CSVPreviewTable';
import { CSVImportOptions } from './CSVImportOptions';
import { CSVSuccessBanner } from './CSVSuccessBanner';
import { CSVInputZone } from './CSVInputZone';

interface CSVUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (firstTeamId?: string) => void;
}

export const CSVUploadModal: React.FC<CSVUploadModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { updateTeamsFromCSV, sendTeamToScreen, teams } = useHackathon();

  const [activeTab, setActiveTab] = useState<'upload' | 'paste'>('upload');
  const [selectedFileName, setSelectedFileName] = useState<string>('');
  const [rawText, setRawText] = useState<string>('');
  const [parsedRecords, setParsedRecords] = useState<CSVTeamRecord[]>([]);
  const [parseErrors, setParseErrors] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [importMode, setImportMode] = useState<'replace' | 'append'>('replace');
  const [autoLaunchFirst, setAutoLaunchFirst] = useState<boolean>(true);
  const [importResult, setImportResult] = useState<{
    added: number;
    updated: number;
    total: number;
    firstTeamId?: string;
  } | null>(null);

  if (!isOpen) return null;

  const processCSVText = (content: string, fileName?: string) => {
    if (fileName) setSelectedFileName(fileName);
    setRawText(content);
    setImportResult(null);

    const result = parseTeamsCSV(content);
    setParsedRecords(result.records);
    setParseErrors(result.errors);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      processCSVText(text, file.name);
    };
    reader.readAsText(file);
  };

  const handleDownloadSample = () => {
    const sample = getSampleCSVContent();
    const blob = new Blob([sample], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'sih2026_teams_sample.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExecuteImport = () => {
    if (parsedRecords.length === 0) return;
    setIsProcessing(true);

    try {
      const isReplace = importMode === 'replace';
      const res = updateTeamsFromCSV(parsedRecords, isReplace);
      const firstImported = res.teams.find((t) =>
        parsedRecords.some((r) => r.teamName.trim().toLowerCase() === t.name.trim().toLowerCase())
      ) || res.teams[0];

      if (autoLaunchFirst && firstImported) {
        sendTeamToScreen(firstImported.id, 6);
      }

      setImportResult({
        added: res.added,
        updated: res.updated,
        total: res.total,
        firstTeamId: firstImported?.id
      });
    } catch (err) {
      console.error(err);
      alert('An error occurred while importing teams.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setSelectedFileName('');
    setRawText('');
    setParsedRecords([]);
    setParseErrors([]);
    setImportResult(null);
  };

  const existingTeamNamesSet = new Set(teams.map((t) => t.name.trim().toLowerCase()));

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-3xl w-full shadow-2xl overflow-hidden text-slate-800 my-8">
        <div className="p-6 border-b border-slate-200 bg-[#faf7f2] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-100 border border-orange-200 flex items-center justify-center text-orange-600">
              <FileSpreadsheet className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <span className="px-2 py-0.5 rounded-md bg-orange-600 text-white font-mono text-[10px] font-black uppercase">
                CSV Uploader
              </span>
              <h3 className="font-black text-slate-900 text-lg sm:text-xl">Import Teams via CSV</h3>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-slate-800 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {importResult && (
            <CSVSuccessBanner
              importResult={importResult}
              onSendToScreen={(teamId) => {
                sendTeamToScreen(teamId, 6);
                if (onSuccess) onSuccess(teamId);
                onClose();
              }}
              onFinish={() => {
                if (onSuccess) onSuccess();
                onClose();
              }}
            />
          )}

          <CSVInputZone
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            selectedFileName={selectedFileName}
            rawText={rawText}
            parseErrors={parseErrors}
            onFileSelect={handleFileChange}
            onPasteChange={(txt) => processCSVText(txt, 'pasted_data.csv')}
            onDownloadSample={handleDownloadSample}
          />

          <CSVPreviewTable
            parsedRecords={parsedRecords}
            existingTeamNamesSet={existingTeamNamesSet}
            onReset={handleReset}
          />

          <CSVImportOptions
            parsedRecords={parsedRecords}
            importMode={importMode}
            setImportMode={setImportMode}
            autoLaunchFirst={autoLaunchFirst}
            setAutoLaunchFirst={setAutoLaunchFirst}
          />
        </div>

        <div className="p-5 border-t border-slate-200 bg-[#faf7f2] flex items-center justify-between">
          <span className="text-xs text-slate-500 font-mono">{parsedRecords.length} teams ready</span>
          <div className="flex items-center gap-2">
            <button onClick={onClose} className="px-4 py-2 rounded-xl bg-white border border-slate-300 text-xs font-bold">
              Cancel
            </button>
            <button
              disabled={parsedRecords.length === 0 || isProcessing}
              onClick={handleExecuteImport}
              className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 disabled:opacity-40 text-white font-extrabold text-xs"
            >
              {isProcessing ? 'Processing...' : `Import ${parsedRecords.length} Teams`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
