import React, { useState, useRef } from 'react';
import { useHackathon } from '../../context/HackathonContext';
import { CSVTeamRecord } from '../../types';
import { parseTeamsCSV, getSampleCSVContent } from '../../utils/csvParser';
import { 
  Upload, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink, 
  Download, 
  X, 
  FileSpreadsheet, 
  Sparkles,
  ArrowRight,
  RefreshCw,
  Tv
} from 'lucide-react';

interface CSVUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (firstTeamId?: string) => void;
}

export const CSVUploadModal: React.FC<CSVUploadModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { updateTeamsFromCSV, sendTeamToScreen, teams } = useHackathon();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState<'upload' | 'paste'>('upload');
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [selectedFileName, setSelectedFileName] = useState<string>('');
  const [rawText, setRawText] = useState<string>('');
  const [parsedRecords, setParsedRecords] = useState<CSVTeamRecord[]>([]);
  const [parseErrors, setParseErrors] = useState<string[]>([]);
  const [totalRowsDetected, setTotalRowsDetected] = useState<number>(0);
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

  // Process raw text content from either file or text area
  const processCSVText = (content: string, fileName?: string) => {
    if (fileName) setSelectedFileName(fileName);
    setRawText(content);
    setImportResult(null);

    const result = parseTeamsCSV(content);
    setParsedRecords(result.records);
    setParseErrors(result.errors);
    setTotalRowsDetected(result.totalRowsFound);
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

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        processCSVText(text, file.name);
      };
      reader.readAsText(file);
    }
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
    setTotalRowsDetected(0);
    setImportResult(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const existingTeamNamesSet = new Set(teams.map((t) => t.name.trim().toLowerCase()));

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-3xl w-full shadow-2xl overflow-hidden text-slate-800 my-8">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 bg-[#faf7f2] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-100 border border-orange-200 flex items-center justify-center text-orange-600 shadow-2xs">
              <FileSpreadsheet className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-orange-600 text-white font-mono text-[10px] font-black uppercase">
                  CSV Uploader
                </span>
                <span className="text-xs font-mono font-bold text-slate-500">TIT Incubation Lineup</span>
              </div>
              <h3 className="font-black text-slate-900 text-lg sm:text-xl tracking-tight">
                Import Teams via CSV
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Success Banner if import was completed */}
          {importResult && (
            <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-extrabold text-emerald-950 text-base">
                    Teams Successfully Updated in Context!
                  </h4>
                  <p className="text-xs text-emerald-800 mt-1">
                    Processed <strong>{importResult.total}</strong> records:{' '}
                    <strong>{importResult.added}</strong> new squads added to presentation line,{' '}
                    <strong>{importResult.updated}</strong> existing squads updated with Google Drive links.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 pt-2 border-t border-emerald-200">
                {importResult.firstTeamId && (
                  <button
                    onClick={() => {
                      sendTeamToScreen(importResult.firstTeamId!, 6);
                      if (onSuccess) onSuccess(importResult.firstTeamId);
                      onClose();
                    }}
                    className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                  >
                    <Tv className="w-3.5 h-3.5" />
                    <span>Send First Team ({importResult.firstTeamId}) to Projector Screen</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    if (onSuccess) onSuccess();
                    onClose();
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>Done · View Presentation Line</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Mode Switcher & Download Sample */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200 self-start">
              <button
                type="button"
                onClick={() => setActiveTab('upload')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'upload'
                    ? 'bg-white text-orange-600 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Upload CSV File
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('paste')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'paste'
                    ? 'bg-white text-orange-600 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Paste CSV Text
              </button>
            </div>

            <button
              type="button"
              onClick={handleDownloadSample}
              className="text-xs font-mono font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1.5 hover:underline cursor-pointer self-start sm:self-auto"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download CSV Template</span>
            </button>
          </div>

          {/* Required Fields Info Banner */}
          <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Required CSV Columns: </span>
              <code className="font-mono font-bold text-orange-700 bg-orange-100/60 px-1 py-0.5 rounded">
                Team Name, Track, Google Drive Link
              </code>
              <p className="text-[11px] text-amber-800/90 mt-1">
                Supported Tracks: <strong>AI &amp; Robotics</strong>, <strong>Web3 &amp; Cloud</strong>, <strong>HealthTech &amp; Bio</strong>, <strong>Smart Cities &amp; IoT</strong>.
              </p>
            </div>
          </div>

          {/* Tab 1: File Drag & Drop */}
          {activeTab === 'upload' && (
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,text/csv,text/plain"
                onChange={handleFileChange}
                className="hidden"
              />

              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`p-8 border-2 border-dashed rounded-3xl text-center cursor-pointer transition-all ${
                  dragActive
                    ? 'border-orange-500 bg-orange-50/60 scale-[1.01]'
                    : selectedFileName
                    ? 'border-emerald-400 bg-emerald-50/30'
                    : 'border-slate-300 hover:border-orange-400 bg-[#faf7f2]/60 hover:bg-orange-50/30'
                }`}
              >
                <div className="flex flex-col items-center justify-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
                      selectedFileName ? 'bg-emerald-100 text-emerald-600' : 'bg-orange-100 text-orange-600'
                    }`}
                  >
                    <Upload className="w-6 h-6" />
                  </div>

                  <div>
                    {selectedFileName ? (
                      <div>
                        <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-md">
                          {selectedFileName}
                        </span>
                        <p className="text-xs text-slate-500 mt-2">
                          Click or drag another file to replace
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-sm font-bold text-slate-800">
                          Click to select a CSV file, or drag and drop here
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          Accepts .csv format containing Team Name, Track, and Google Drive Link
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Raw Text Paste */}
          {activeTab === 'paste' && (
            <div className="space-y-2">
              <label className="block text-xs font-mono font-bold text-slate-600">
                Paste CSV or Spreadsheet rows:
              </label>
              <textarea
                rows={6}
                value={rawText}
                onChange={(e) => processCSVText(e.target.value, 'pasted_data.csv')}
                placeholder={`Team Name,Track,Google Drive Link\nAeroVision TIT,AI & Robotics,https://drive.google.com/drive/folders/1AeroVisionTIT2026\nBlockMesh Labs,Web3 & Cloud,https://drive.google.com/drive/folders/1BlockMeshWeb3TIT`}
                className="w-full p-3 rounded-2xl bg-[#faf7f2] border border-slate-300 text-xs font-mono text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500 resize-y"
              />
            </div>
          )}

          {/* Validation Errors */}
          {parseErrors.length > 0 && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-rose-600" />
                <span>Warnings encountered while reading CSV:</span>
              </div>
              <ul className="list-disc pl-5 space-y-0.5 text-[11px]">
                {parseErrors.slice(0, 4).map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Parsed Preview Table */}
          {parsedRecords.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-slate-700">
                    PARSED SQUADS PREVIEW
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 text-[10px] font-mono font-bold">
                    {parsedRecords.length} squads ready
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleReset}
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
                            <span
                              className={`px-2 py-0.5 rounded-md font-mono text-[10px] font-bold ${
                                record.track === 'AI & Robotics'
                                  ? 'bg-purple-100 text-purple-800'
                                  : record.track === 'Web3 & Cloud'
                                  ? 'bg-blue-100 text-blue-800'
                                  : record.track === 'HealthTech & Bio'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
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
          )}

          {/* Import Mode & Options */}
          {parsedRecords.length > 0 && (
            <div className="p-4 rounded-2xl bg-orange-50/70 border border-orange-200/80 space-y-3">
              <div className="text-xs font-mono font-bold text-orange-900 uppercase flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-orange-600" />
                <span>Dataset Import Configuration</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <label className={`flex items-start gap-2.5 p-3 rounded-xl border transition-all cursor-pointer ${importMode === 'replace' ? 'bg-white border-orange-500 shadow-xs ring-1 ring-orange-500' : 'bg-white/60 border-orange-200 hover:bg-white'}`}>
                  <input
                    type="radio"
                    name="importMode"
                    value="replace"
                    checked={importMode === 'replace'}
                    onChange={() => setImportMode('replace')}
                    className="mt-0.5 text-orange-600 focus:ring-orange-500"
                  />
                  <div>
                    <span className="font-bold text-slate-900 block">Clean Slate (Replace all data)</span>
                    <span className="text-[11px] text-slate-500 leading-tight block mt-0.5">
                      Purges any leftover mock data and loads strictly your real CSV squads.
                    </span>
                  </div>
                </label>

                <label className={`flex items-start gap-2.5 p-3 rounded-xl border transition-all cursor-pointer ${importMode === 'append' ? 'bg-white border-orange-500 shadow-xs ring-1 ring-orange-500' : 'bg-white/60 border-orange-200 hover:bg-white'}`}>
                  <input
                    type="radio"
                    name="importMode"
                    value="append"
                    checked={importMode === 'append'}
                    onChange={() => setImportMode('append')}
                    className="mt-0.5 text-orange-600 focus:ring-orange-500"
                  />
                  <div>
                    <span className="font-bold text-slate-900 block">Append to Existing Line</span>
                    <span className="text-[11px] text-slate-500 leading-tight block mt-0.5">
                      Updates matching squads and adds new squads to the end of the lineup.
                    </span>
                  </div>
                </label>
              </div>

              <label className="flex items-center gap-2 pt-1 text-xs text-slate-700 font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoLaunchFirst}
                  onChange={(e) => setAutoLaunchFirst(e.target.checked)}
                  className="rounded text-orange-600 focus:ring-orange-500"
                />
                <span>Immediately send first squad ({parsedRecords[0]?.teamName || 'Squad 1'}) to Projector Screen</span>
              </label>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-5 border-t border-slate-200 bg-[#faf7f2] flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-slate-500 font-mono">
            {parsedRecords.length > 0 ? (
              <span>Ready to update context with {parsedRecords.length} teams</span>
            ) : (
              <span>Upload or paste a CSV file to preview</span>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="button"
              disabled={parsedRecords.length === 0 || isProcessing}
              onClick={handleExecuteImport}
              className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 disabled:opacity-40 text-white font-extrabold text-xs transition-all shadow-md shadow-orange-600/20 flex items-center gap-2 cursor-pointer"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Import {parsedRecords.length > 0 ? `${parsedRecords.length} Teams` : 'Data'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
