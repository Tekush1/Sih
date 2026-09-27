import React, { useState } from 'react';
import { ChevronDown, Mail, Phone, MapPin, MessageSquare, Send } from 'lucide-react';

export const ContactFaqSection: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [feedbackSent, setFeedbackSent] = useState<boolean>(false);
  const [queryName, setQueryName] = useState<string>('');
  const [queryEmail, setQueryEmail] = useState<string>('');
  const [queryMessage, setQueryMessage] = useState<string>('');

  const faqs = [
    {
      q: 'How does the TIT Bhopal internal hackathon connect to Smart India Hackathon (SIH 2026)?',
      a: 'This internal hackathon serves as the official college-level qualifier for Technocrats Institute of Technology (TIT), Bhopal. Evaluated by our faculty jury and industry experts, top-ranking teams in Software and Hardware categories are formally nominated to represent TIT Bhopal on the central SIH portal (sih.gov.in).'
    },
    {
      q: 'How do we select and fetch our official SIH Problem Statement ID?',
      a: 'Use our integrated SIH live data fetcher in the Registration tab or click "Fetch & Browse SIH PS". You can type any official ID (such as SIH1601, SIH1609, SIH1622, SIH1635, SIH1702, SIH1720) to fetch the title, organization/ministry, and scope description automatically.'
    },
    {
      q: 'How does the automated 6-minute presentation engine work?',
      a: 'To guarantee absolute fairness across all teams, presentations embed the team’s original Google Drive presentation deck with automated stage countdown timers and slide cadence markers (10s, 1m, 1m, 40s, 40s, 20s). When the 6-minute pitch completes, the auditorium screen signals completion.'
    },
    {
      q: 'How is Google Drive integrated with our team account?',
      a: 'When your team registers, our backend provisions a dedicated team Google Drive folder (/SmartHackathon2026/Teams/SH26-XXX/). Every PPTX or PDF upload is securely archived, versioned (v1.0, v2.0), and parsed into the presentation engine.'
    },
    {
      q: 'What is required to receive our Digital QR Presentation Pass?',
      a: 'The TIT Evaluation Committee must review and approve your uploaded presentation deck. Once approved, the system generates a cryptographic QR token containing your Team ID, stage arena, and scheduled 6-minute window. You scan this at the stage entrance.'
    },
    {
      q: 'What is the recommended team composition for SIH eligibility?',
      a: 'As per AICTE / Ministry of Education guidelines for Smart India Hackathon, teams must consist of students from Technocrats Institute of Technology, and each team must include at least 1 female member to qualify for nomination.'
    }
  ];

  const handleSendFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedbackSent(true);
    setTimeout(() => {
      setFeedbackSent(false);
      setQueryName('');
      setQueryEmail('');
      setQueryMessage('');
    }, 3000);
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-mono font-bold uppercase tracking-widest text-orange-600 block">
          07. FAQS &amp; STAGE COORDINATION
        </span>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-[#0f172a] tracking-tight">
          Frequently Asked Questions
        </h2>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          Everything you need to know about stage arrivals, QR pass validation, slide limits, and judging protocols at Technocrats Institute of Technology.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* FAQs Accordion */}
        <div className="lg:col-span-7 space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-white border border-slate-200/90 shadow-xs overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 text-slate-900 hover:text-orange-600 transition-colors cursor-pointer"
                >
                  <span className="font-bold text-sm sm:text-base">{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-orange-600 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Contact & Stage Marshals Card */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 md:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-6">
            <div>
              <h3 className="text-xl font-bold text-slate-900">Stage Helpdesk &amp; Marshals</h3>
              <p className="text-xs text-slate-500 mt-1">
                Reach our technical and stage coordinators during demo hours.
              </p>
            </div>

            <div className="space-y-4 text-xs font-mono text-slate-700">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-[#faf7f2] border border-amber-100">
                <MapPin className="w-4 h-4 text-orange-600 shrink-0" />
                <div>
                  <span className="text-slate-900 font-bold">TIT Bhopal Hackathon Cell</span>
                  <p className="text-slate-500 text-[11px] font-sans">Technocrats Institute of Technology, Anand Nagar, Bhopal, MP 462021</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-[#faf7f2] border border-amber-100">
                <Mail className="w-4 h-4 text-orange-600 shrink-0" />
                <div>
                  <span className="text-slate-900 font-bold">sih2026@titbhopal.edu.in</span>
                  <p className="text-slate-500 text-[11px] font-sans">Faculty &amp; Student Hackathon Committee</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-[#faf7f2] border border-amber-100">
                <Phone className="w-4 h-4 text-[#b47e3a] shrink-0" />
                <div>
                  <span className="text-slate-900 font-bold">+91 (755) 2751693 / +91 98260 12345</span>
                  <p className="text-slate-500 text-[11px] font-sans">TIT Campus Internal Hackathon Coordinator</p>
                </div>
              </div>
            </div>

            {/* Quick Contact Form */}
            <form onSubmit={handleSendFeedback} className="space-y-3 pt-2">
              <input
                type="text"
                required
                placeholder="Your Name / Team ID"
                value={queryName}
                onChange={(e) => setQueryName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf7f2] border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500"
              />
              <input
                type="email"
                required
                placeholder="Email Address"
                value={queryEmail}
                onChange={(e) => setQueryEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf7f2] border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500"
              />
              <textarea
                rows={2}
                required
                placeholder="How can our technical team assist your squad?"
                value={queryMessage}
                onChange={(e) => setQueryMessage(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf7f2] border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500 font-sans"
              />
              <button
                type="submit"
                disabled={feedbackSent}
                className="w-full py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
              >
                {feedbackSent ? (
                  <span>Message Dispatched to Tech Desk!</span>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Message to Marshals</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
