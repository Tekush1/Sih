import React from 'react';
import { ExternalLink, CheckCircle2 } from 'lucide-react';

export const RegistrationGoogleFormEmbedView: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto rounded-3xl bg-white border border-slate-200/90 shadow-sm overflow-hidden p-6 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <h3 className="font-extrabold text-slate-900 text-base">Direct Google Form Interface</h3>
          <p className="text-xs text-slate-500">Official TIT Smart India Hackathon Registration Form</p>
        </div>
        <a
          href="https://docs.google.com/forms"
          target="_blank"
          rel="noreferrer"
          className="text-xs font-mono text-orange-600 hover:text-orange-700 flex items-center gap-1 font-bold"
        >
          <span>Open Full Form</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      <div className="p-8 rounded-2xl bg-[#faf7f2] border border-slate-200 text-center space-y-3">
        <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h4 className="text-base font-bold text-slate-900">Google Form Connected</h4>
        <p className="text-xs text-slate-600 max-w-md mx-auto">
          All entries submitted via the official Google Form are automatically captured and routed to the 6-minute presentation queue.
        </p>
      </div>
    </div>
  );
};
