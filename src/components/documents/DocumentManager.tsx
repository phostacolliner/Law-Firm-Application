import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { LegalDocument, DocumentCategory } from '../../types';
import { 
  FolderOpen, 
  FileText, 
  Search, 
  Plus, 
  Sparkles, 
  Eye, 
  Download, 
  Tag, 
  CheckCircle, 
  Clock, 
  Scale, 
  ShieldCheck,
  FileCheck2,
  Loader2,
  X
} from 'lucide-react';
import { DropdownDatePicker } from '../common/DropdownDatePicker';
import { SectorExportButton } from '../reports/SectorExportButton';

interface DocumentManagerProps {
  onOpenNewDocument: () => void;
}

export const DocumentManager: React.FC<DocumentManagerProps> = ({ onOpenNewDocument }) => {
  const { documents, matters, setSelectedMatterId, setActiveTab } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedMatterFilter, setSelectedMatterFilter] = useState<string>('all');
  const [uploadDateFilter, setUploadDateFilter] = useState<string>('');

  // Preview & AI Analysis State
  const [inspectingDoc, setInspectingDoc] = useState<LegalDocument | null>(documents[0] || null);
  const [aiAnalyzing, setAiAnalyzing] = useState(false);
  const [aiAnalysisResult, setAiAnalysisResult] = useState<any>(null);

  const categories: DocumentCategory[] = [
    'Pleadings', 'Court Orders', 'Evidence', 'Conveyancing Deeds', 'Correspondence', 'Billing', 'Legal Opinions'
  ];

  const filteredDocs = documents.filter(d => {
    const matchesSearch = 
      d.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.matterNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = categoryFilter === 'all' || d.category === categoryFilter;
    const matchesMatter = selectedMatterFilter === 'all' || d.matterId === selectedMatterFilter;
    const docDate = d.uploadedDate || d.uploadedAt?.slice(0, 10) || '';
    const matchesDate = !uploadDateFilter || docDate >= uploadDateFilter;

    return matchesSearch && matchesCategory && matchesMatter && matchesDate;
  });

  const handleRunAiAnalysis = async (doc: LegalDocument) => {
    setAiAnalyzing(true);
    setAiAnalysisResult(null);

    const docText = doc.contentSnippet || `${doc.title}\n${doc.category} filed in matter ${doc.matterNumber}`;

    try {
      const res = await fetch('/api/ai/analyze-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: docText,
          analysisType: 'comprehensive',
          matterTitle: doc.matterNumber
        })
      });

      const data = await res.json();
      setAiAnalysisResult(data);
    } catch (err: any) {
      setAiAnalysisResult({
        summary: 'Failed to analyze document with AI. Please check internet connection.',
        keyOrders: [],
        issuesForDetermination: [],
        limitationPeriod: 'N/A',
        recommendedActions: []
      });
    } finally {
      setAiAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <FolderOpen className="w-5 h-5 text-amber-400" />
            Digital Document Archive & AI Analysis
          </h1>
          <p className="text-xs text-slate-400">
            Matter-organized pleadings, court orders, deeds, evidence, and Gemini-powered judgment analysis
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <SectorExportButton
            sectorKey="documents"
            reportTitle="Digital Document Archive & Evidentiary Index"
            reportSubtitle="Catalog of filed pleadings, court rulings, affidavits, trial bundles, and land deeds"
            sectorName="Document Archive"
            statutoryReference="Evidence Act & Kenya Judiciary E-Filing Rules"
            filenamePrefix="LexisFirm_Document_Index"
            headers={['Document Title', 'Matter No', 'Category', 'File Name', 'Format', 'Size', 'Uploaded By', 'Date Added', 'Client Portal']}
            rows={filteredDocs.map(d => [
              d.title,
              d.matterNumber,
              d.category,
              d.fileName,
              d.fileType,
              d.fileSize,
              d.uploadedBy,
              d.uploadedDate || d.uploadedAt?.slice(0, 10) || '2026-09-01',
              d.isClientVisible ? 'Visible to Client' : 'Internal Privilege'
            ])}
            summaryStats={[
              { label: 'Total Documents', value: filteredDocs.length, highlight: true },
              { label: 'Pleadings & Filings', value: filteredDocs.filter(d => d.category === 'Pleadings').length },
              { label: 'Court Orders & Rulings', value: filteredDocs.filter(d => d.category === 'Court Orders').length },
              { label: 'Client Visible', value: filteredDocs.filter(d => d.isClientVisible).length }
            ]}
          />

          <button
            onClick={onOpenNewDocument}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Upload Document</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row gap-3 items-center justify-between shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search documents by title, file name, tags, matter..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-amber-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap w-full md:w-auto">
          {/* Upload Date Filter with Dropdown Calendar */}
          <div className="w-40">
            <DropdownDatePicker
              value={uploadDateFilter}
              onChange={(d) => setUploadDateFilter(d)}
              placeholder="Upload Date..."
              showPresets={true}
            />
          </div>
          {uploadDateFilter && (
            <button
              onClick={() => setUploadDateFilter('')}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-xs cursor-pointer"
              title="Clear date filter"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-amber-500 cursor-pointer"
          >
            <option value="all">All Document Types</option>
            {categories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          {/* Matter Filter */}
          <select
            value={selectedMatterFilter}
            onChange={(e) => setSelectedMatterFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-amber-500 cursor-pointer"
          >
            <option value="all">All Matters</option>
            {matters.map(m => (
              <option key={m.id} value={m.id}>{m.matterNumber}: {m.title.substring(0, 25)}...</option>
            ))}
          </select>
        </div>
      </div>

      {/* Two-Column Layout: Documents List & Detailed Viewer with AI */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Documents Directory (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm flex flex-col max-h-[750px]">
          <div className="p-3 bg-slate-850 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold uppercase tracking-wider text-[11px]">Digital Matter Records</span>
            <span>{filteredDocs.length} files</span>
          </div>

          <div className="overflow-y-auto divide-y divide-slate-800/80 flex-1">
            {filteredDocs.map(doc => {
              const isSelected = inspectingDoc?.id === doc.id;
              return (
                <div
                  key={doc.id}
                  onClick={() => {
                    setInspectingDoc(doc);
                    setAiAnalysisResult(null);
                  }}
                  className={`p-3.5 transition-all cursor-pointer flex items-start justify-between gap-3 ${
                    isSelected ? 'bg-amber-500/10 border-l-4 border-amber-400' : 'hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 shrink-0 mt-0.5">
                      <FileText className="w-4 h-4" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-bold text-white truncate">{doc.title}</p>
                        <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-amber-300 border border-slate-700">
                          {doc.version}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                        {doc.fileName} • {doc.fileSize}
                      </p>

                      <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
                          {doc.category}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {doc.matterNumber}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[10px] text-slate-400 block font-mono">{doc.uploadedAt}</span>
                    {doc.isClientVisible && (
                      <span className="text-[9px] text-emerald-400 font-semibold block mt-1">Client Visible</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Document Viewer & AI Assistant (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {inspectingDoc ? (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-5">
              {/* Document Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-4 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                      {inspectingDoc.matterNumber}
                    </span>
                    <span className="text-xs font-mono text-slate-400">{inspectingDoc.category}</span>
                  </div>
                  <h2 className="text-base font-bold text-white mt-1">{inspectingDoc.title}</h2>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">
                    File: {inspectingDoc.fileName} • {inspectingDoc.fileSize} • Uploaded by {inspectingDoc.uploadedBy} on {inspectingDoc.uploadedAt}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleRunAiAnalysis(inspectingDoc)}
                    disabled={aiAnalyzing}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-purple-600 hover:bg-purple-500 text-white transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {aiAnalyzing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                    <span>AI Deep Analysis</span>
                  </button>
                </div>
              </div>

              {/* Tags */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <Tag className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-xs text-slate-400">Tags:</span>
                {inspectingDoc.tags.map(t => (
                  <span key={t} className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                    {t}
                  </span>
                ))}
              </div>

              {/* AI Analysis Output Section */}
              {aiAnalysisResult && (
                <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/40 space-y-3 text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-purple-500/30">
                    <span className="font-bold text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-purple-400" />
                      Gemini 3.8 Legal Intelligence Synthesis
                    </span>
                    <span className="font-mono text-[10px] text-purple-400">Automated Legal Extraction</span>
                  </div>

                  <div>
                    <h4 className="font-bold text-white uppercase text-[10px] tracking-wider mb-1">Executive Summary</h4>
                    <p className="text-slate-200 leading-relaxed">{aiAnalysisResult.summary}</p>
                  </div>

                  {aiAnalysisResult.keyOrders?.length > 0 && (
                    <div>
                      <h4 className="font-bold text-amber-300 uppercase text-[10px] tracking-wider mb-1">Extracted Orders & Directives</h4>
                      <ul className="list-disc list-inside space-y-1 text-slate-300 pl-1">
                        {aiAnalysisResult.keyOrders.map((ord: string, i: number) => (
                          <li key={i}>{ord}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {aiAnalysisResult.issuesForDetermination?.length > 0 && (
                    <div>
                      <h4 className="font-bold text-blue-300 uppercase text-[10px] tracking-wider mb-1">Issues for Determination</h4>
                      <ul className="list-disc list-inside space-y-1 text-slate-300 pl-1">
                        {aiAnalysisResult.issuesForDetermination.map((iss: string, i: number) => (
                          <li key={i}>{iss}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {aiAnalysisResult.limitationPeriod && (
                    <div>
                      <h4 className="font-bold text-emerald-300 uppercase text-[10px] tracking-wider mb-1">Statutory Limitation & Procedural Status</h4>
                      <p className="text-slate-300">{aiAnalysisResult.limitationPeriod}</p>
                    </div>
                  )}

                  {aiAnalysisResult.recommendedActions?.length > 0 && (
                    <div className="pt-2 border-t border-purple-500/20">
                      <h4 className="font-bold text-amber-400 uppercase text-[10px] tracking-wider mb-1">Recommended Advocate Action</h4>
                      <div className="grid grid-cols-1 gap-1">
                        {aiAnalysisResult.recommendedActions.map((act: string, i: number) => (
                          <div key={i} className="flex items-center gap-2 text-slate-200 bg-slate-900/60 p-1.5 rounded">
                            <CheckCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                            <span>{act}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Document Text Content Viewer */}
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                  Document Preview & Pleading Transcript
                </span>
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 leading-relaxed whitespace-pre-wrap max-h-[340px] overflow-y-auto">
                  {inspectingDoc.contentSnippet || 'Document content archived in secure digital repository.'}
                </div>
              </div>

              {/* Footer info */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <button
                  onClick={() => {
                    setSelectedMatterId(inspectingDoc.matterId);
                    setActiveTab('matters');
                  }}
                  className="text-amber-400 hover:text-amber-300 font-medium"
                >
                  Jump to Matter Dossier ({inspectingDoc.matterNumber}) →
                </button>
                <span>Version: {inspectingDoc.version}</span>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-slate-400 bg-slate-900 border border-slate-800 rounded-xl">
              Select a document to inspect or analyze.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
