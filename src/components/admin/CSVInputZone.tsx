import React, { useRef } from 'react';
import { Upload, Download } from 'lucide-react';

interface CSVInputZoneProps {
  activeTab: 'upload' | 'paste';
  setActiveTab: (tab: 'upload' | 'paste') => void;
  selectedFileName: string;
  rawText: string;
  parseErrors: string[];
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPasteChange: (text: string) => void;
  onDownloadSample: () => void;
}

export const CSVInputZone: React.FC<CSVInputZoneProps> = ({
  activeTab,
  setActiveTab,
  selectedFileName,
  rawText,
  parseErrors,
  onFileSelect,
  onPasteChange,
  onDownloadSample
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200 self-start">
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold ${
              activeTab === 'upload' ? 'bg-white text-orange-600 shadow-2xs' : 'text-slate-600'
            }`}
          >
            Upload CSV File
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('paste')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold ${
              activeTab === 'paste' ? 'bg-white text-orange-600 shadow-2xs' : 'text-slate-600'
            }`}
          >
            Paste CSV Text
          </button>
        </div>

        <button
          type="button"
          onClick={onDownloadSample}
          className="text-xs font-mono font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1.5"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download CSV Template</span>
        </button>
      </div>

      {activeTab === 'upload' && (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,text/csv,text/plain"
            onChange={onFileSelect}
            className="hidden"
          />
          <div
            onClick={() => fileInputRef.current?.click()}
            className="p-8 border-2 border-dashed rounded-3xl text-center cursor-pointer border-slate-300 hover:border-orange-400 bg-[#faf7f2]/60"
          >
            <Upload className="w-8 h-8 text-orange-600 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-800">
              {selectedFileName ? selectedFileName : 'Click to select a CSV file, or drag and drop here'}
            </p>
          </div>
        </div>
      )}

      {activeTab === 'paste' && (
        <textarea
          rows={6}
          value={rawText}
          onChange={(e) => onPasteChange(e.target.value)}
          placeholder="Paste Google Form CSV data here..."
          className="w-full p-3 rounded-2xl bg-[#faf7f2] border border-slate-300 text-xs font-mono"
        />
      )}

      {parseErrors.length > 0 && (
        <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800">
          <span className="font-bold">Warnings:</span> {parseErrors.slice(0, 3).join(', ')}
        </div>
      )}
    </div>
  );
};
