import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Sparkles, 
  FileText, 
  Scale, 
  Send, 
  Copy, 
  Check, 
  Download, 
  BookOpen, 
  Loader2, 
  AlertCircle,
  Building,
  ShieldCheck
} from 'lucide-react';

export const AiLegalAssistant: React.FC = () => {
  const { matters, formatKSh } = useApp();

  const [activeTab, setActiveTabState] = useState<'drafter' | 'analyzer' | 'research'>('drafter');

  // Drafter State
  const [docType, setDocType] = useState('Demand Letter');
  const [selectedMatterId, setSelectedMatterId] = useState(matters[0]?.id || '');
  const [clientName, setClientName] = useState(matters[0]?.clientName || 'ABC Limited');
  const [opposingParty, setOpposingParty] = useState(matters[0]?.opposingParty || 'XYZ Logistics Limited');
  const [claimAmount, setClaimAmount] = useState('4500000');
  const [facts, setFacts] = useState('Breach of commercial contractual terms, failed delivery of logistics consignments, and refusal to honor liquidated damages agreement.');
  const [draftResult, setDraftResult] = useState('');
  const [draftingLoading, setDraftingLoading] = useState(false);
  const [copiedDraft, setCopiedDraft] = useState(false);

  // Analyzer State
  const [sampleDocText, setSampleDocText] = useState(`IN THE EMPLOYMENT AND LABOUR RELATIONS COURT AT NAIROBI
CAUSE NO. 89 OF 2026
ABC LIMITED ......................................... CLAIMANT
VERSUS
XYZ LOGISTICS LIMITED ................... 1ST RESPONDENT

RULING ON INTERLOCUTORY INJUNCTION
1. By an Application brought under Certificate of Urgency, the Claimant seeks an interim injunction restraining the 1st Respondent from alienating commercial assets pending hearing and determination of this suit.
2. The Applicant argues that a valid employment and supply contract was executed in January 2026 and breach occurred resulting in loss of KSh 4,500,000.
3. Having considered the principles in Giella v Cassman Brown [1973] EA 358, the Court finds that the Applicant has established a prima facie case with probability of success.
4. Consequently, the Court orders:
   (a) An order of temporary maintenance of status quo is hereby issued for 21 days;
   (b) The Respondents to file replying affidavits within 14 days;
   (c) Matter to be mentioned on 29th September 2026 before Court 4 for further trial directions.`);
  const [analyzingLoading, setAnalyzingLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  // Handle Matter selection change
  const handleMatterChange = (id: string) => {
    setSelectedMatterId(id);
    const m = matters.find(item => item.id === id);
    if (m) {
      setClientName(m.clientName);
      setOpposingParty(m.opposingParty);
      setClaimAmount(String(m.estimatedValue || '1500000'));
    }
  };

  const handleGenerateDraft = async () => {
    setDraftingLoading(true);
    setDraftResult('');
    setCopiedDraft(false);

    const m = matters.find(item => item.id === selectedMatterId);

    try {
      const res = await fetch('/api/ai/draft-legal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentType: docType,
          clientName,
          opposingParty,
          matterTitle: m?.title || `${clientName} v. ${opposingParty}`,
          matterFacts: facts,
          courtDetails: m?.court || 'Milimani Commercial Courts, Nairobi',
          advocateName: 'Phosta Colliner, SC (Senior Advocate)',
          claimAmount
        })
      });

      const data = await res.json();
      setDraftResult(data.draft || 'Failed to generate legal draft.');
    } catch (err: any) {
      setDraftResult('Error connecting to legal intelligence server.');
    } finally {
      setDraftingLoading(false);
    }
  };

  const handleAnalyzeJudgment = async () => {
    if (!sampleDocText.trim()) return;
    setAnalyzingLoading(true);
    setAnalysisResult(null);

    try {
      const res = await fetch('/api/ai/analyze-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: sampleDocText,
          analysisType: 'comprehensive',
          matterTitle: 'Court Ruling Analysis'
        })
      });

      const data = await res.json();
      setAnalysisResult(data);
    } catch (err: any) {
      setAnalysisResult({
        summary: 'Error analyzing document text.',
        keyOrders: [],
        issuesForDetermination: [],
        limitationPeriod: 'N/A',
        recommendedActions: []
      });
    } finally {
      setAnalyzingLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedDraft(true);
    setTimeout(() => setCopiedDraft(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-400" />
              AI Legal Drafter & Research Intelligence
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30">
              Powered by Gemini 3.8 Flash
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Automated legal drafting, judgment orders extraction, and statutory limitation analysis for advocates
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex rounded-lg bg-slate-800 p-0.5 border border-slate-700 text-xs self-start sm:self-auto">
          <button
            onClick={() => setActiveTabState('drafter')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
              activeTab === 'drafter' ? 'bg-purple-600 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            AI Legal Drafter
          </button>
          <button
            onClick={() => setActiveTabState('analyzer')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
              activeTab === 'analyzer' ? 'bg-purple-600 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Judgment & Pleading Analyzer
          </button>
        </div>
      </div>

      {activeTab === 'drafter' ? (
        /* TAB 1: AI LEGAL DRAFTER */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Inputs Column (5 cols) */}
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <FileText className="w-4 h-4 text-purple-400" />
              Drafting Parameters & Instructions
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[11px] text-slate-300 font-semibold block mb-1">Select Matter Context</label>
                <select
                  value={selectedMatterId}
                  onChange={(e) => handleMatterChange(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                >
                  {matters.map(m => (
                    <option key={m.id} value={m.id}>{m.matterNumber}: {m.title.substring(0, 35)}...</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] text-slate-300 font-semibold block mb-1">Document Type to Draft</label>
                <select
                  value={docType}
                  onChange={(e) => setDocType(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                >
                  <option value="Demand Letter">Demand Letter / 7-Day Notice</option>
                  <option value="Notice of Intention to Sue">Notice of Intention to Sue (Civil Procedure)</option>
                  <option value="Client Status Update Letter">Client Status Update & Pre-Trial Briefing</option>
                  <option value="Chamber Summons Affidavit Outline">Chamber Summons Supporting Affidavit Outline</option>
                  <option value="Conveyancing Requisition on Title">Conveyancing Requisition on Title</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] text-slate-300 font-semibold block mb-1">Instructing Client</label>
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-300 font-semibold block mb-1">Adverse Party</label>
                  <input
                    type="text"
                    value={opposingParty}
                    onChange={(e) => setOpposingParty(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] text-slate-300 font-semibold block mb-1">Subject / Claim Value (KSh)</label>
                <input
                  type="text"
                  value={claimAmount}
                  onChange={(e) => setClaimAmount(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white font-mono"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-300 font-semibold block mb-1">Material Facts & Legal Grounds</label>
                <textarea
                  value={facts}
                  onChange={(e) => setFacts(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white resize-none"
                  placeholder="Summarize the breach, covenant, or transaction particulars..."
                />
              </div>

              <button
                onClick={handleGenerateDraft}
                disabled={draftingLoading}
                className="w-full py-2.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
              >
                {draftingLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                <span>Generate Professional Legal Draft</span>
              </button>
            </div>
          </div>

          {/* Draft Preview Column (7 cols) */}
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Generated Draft Document
                </span>

                {draftResult && (
                  <button
                    onClick={() => copyToClipboard(draftResult)}
                    className="flex items-center gap-1.5 px-3 py-1 text-xs rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer"
                  >
                    {copiedDraft ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedDraft ? 'Copied' : 'Copy Text'}</span>
                  </button>
                )}
              </div>

              <div className="mt-4 p-5 bg-slate-950 border border-slate-800 rounded-xl min-h-[460px] max-h-[580px] overflow-y-auto text-xs font-mono text-slate-200 leading-relaxed whitespace-pre-wrap">
                {draftingLoading ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-12 text-purple-400 gap-3">
                    <Loader2 className="w-8 h-8 animate-spin" />
                    <p className="font-sans font-semibold">Gemini 3.8 Flash is drafting your advocate document...</p>
                    <p className="font-sans text-[11px] text-slate-400">Applying Kenyan Advocates Remuneration Order & statutory formalities</p>
                  </div>
                ) : draftResult ? (
                  draftResult
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center p-12 text-slate-400 font-sans">
                    <FileText className="w-8 h-8 mb-2 opacity-40 text-purple-400" />
                    <p>Configure parameters on the left and click "Generate Professional Legal Draft".</p>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400 italic">
              Notice: AI-generated drafts are intended for review by an enrolled Advocate of the High Court before service.
            </div>
          </div>
        </div>
      ) : (
        /* TAB 2: JUDGMENT & PLEADING ANALYZER */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Document Input (5 cols) */}
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Scale className="w-4 h-4 text-purple-400" />
                Legal Text / Ruling to Analyze
              </h3>
            </div>

            <textarea
              value={sampleDocText}
              onChange={(e) => setSampleDocText(e.target.value)}
              rows={16}
              className="w-full p-3.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-slate-300 resize-none leading-relaxed focus:outline-none focus:border-purple-500"
              placeholder="Paste ruling, judgment, plaint, or contract here..."
            />

            <button
              onClick={handleAnalyzeJudgment}
              disabled={analyzingLoading}
              className="w-full py-2.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
            >
              {analyzingLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              <span>Extract Orders, Issues & Limitation</span>
            </button>
          </div>

          {/* Analysis Synthesis (7 cols) */}
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 pb-3 border-b border-slate-800 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              Structured AI Analysis Output
            </h3>

            {analyzingLoading ? (
              <div className="p-16 text-center text-purple-400 flex flex-col items-center justify-center gap-3">
                <Loader2 className="w-8 h-8 animate-spin" />
                <p className="text-sm font-semibold">Analyzing legal jurisprudence & orders...</p>
              </div>
            ) : analysisResult ? (
              <div className="space-y-4 text-xs">
                {/* Summary */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <h4 className="font-bold text-amber-300 uppercase text-[10px] tracking-wider">Executive Legal Summary</h4>
                  <p className="text-slate-200 leading-relaxed">{analysisResult.summary}</p>
                </div>

                {/* Key Orders */}
                {analysisResult.keyOrders?.length > 0 && (
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <h4 className="font-bold text-emerald-400 uppercase text-[10px] tracking-wider">
                      Extracted Court Decrees & Orders
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-slate-300">
                      {analysisResult.keyOrders.map((ord: string, i: number) => (
                        <li key={i}>{ord}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Issues */}
                {analysisResult.issuesForDetermination?.length > 0 && (
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <h4 className="font-bold text-blue-400 uppercase text-[10px] tracking-wider">
                      Issues for Determination
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-slate-300">
                      {analysisResult.issuesForDetermination.map((iss: string, i: number) => (
                        <li key={i}>{iss}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Recommended Actions */}
                {analysisResult.recommendedActions?.length > 0 && (
                  <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/30 space-y-2">
                    <h4 className="font-bold text-purple-300 uppercase text-[10px] tracking-wider">
                      Immediate Tactical Steps for Advocate / Clerk
                    </h4>
                    <div className="space-y-1">
                      {analysisResult.recommendedActions.map((act: string, i: number) => (
                        <div key={i} className="flex items-center gap-2 text-slate-200">
                          <Check className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                          <span>{act}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-16 text-center text-slate-400">
                Click "Extract Orders, Issues & Limitation" to process the legal text.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
