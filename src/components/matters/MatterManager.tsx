import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Matter, MatterCategory, MatterStatus } from '../../types';
import { 
  Briefcase, 
  Search, 
  Plus, 
  Filter, 
  Scale, 
  Calendar, 
  Clock, 
  FolderOpen, 
  FileText, 
  CheckSquare, 
  Receipt, 
  MessageSquare, 
  Sparkles, 
  AlertTriangle,
  User,
  Shield,
  ArrowRight,
  Send,
  Loader2
} from 'lucide-react';

interface MatterManagerProps {
  onOpenNewMatter: () => void;
  onOpenNewCourtEvent: (matterId: string) => void;
  onOpenNewDocument: (matterId: string) => void;
}

export const MatterManager: React.FC<MatterManagerProps> = ({ 
  onOpenNewMatter, 
  onOpenNewCourtEvent, 
  onOpenNewDocument 
}) => {
  const { 
    matters, 
    courtEvents, 
    documents, 
    tasks, 
    invoices, 
    communications, 
    selectedMatterId, 
    setSelectedMatterId, 
    setActiveTab, 
    formatKSh 
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [activeDossierTab, setActiveDossierTab] = useState<'overview' | 'documents' | 'court' | 'tasks' | 'billing' | 'comms' | 'ai'>('overview');

  // AI Matter Assistant State
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiConversation, setAiConversation] = useState<Array<{ sender: 'user' | 'ai'; text: string }>>([
    {
      sender: 'ai',
      text: 'Hello Counselor. I am your LexisFirm Legal Case Assistant. You can ask me to inspect missing documents, calculate limitation periods, summarize procedural history, or propose trial tactics.'
    }
  ]);

  const activeMatter = matters.find(m => m.id === selectedMatterId) || matters[0];

  const filteredMatters = matters.filter(m => {
    const matchesSearch = 
      m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.matterNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.caseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.opposingParty.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = categoryFilter === 'all' || m.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || m.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Associated records for active matter
  const matterEvents = courtEvents.filter(e => e.matterId === activeMatter?.id);
  const matterDocs = documents.filter(d => d.matterId === activeMatter?.id);
  const matterTasks = tasks.filter(t => t.matterId === activeMatter?.id);
  const matterInvoices = invoices.filter(i => i.matterId === activeMatter?.id);
  const matterComms = communications.filter(c => c.matterId === activeMatter?.id);

  const handleAskAi = async () => {
    if (!aiPrompt.trim() || !activeMatter) return;
    const userMsg = aiPrompt;
    setAiPrompt('');
    setAiConversation(prev => [...prev, { sender: 'user', text: userMsg }]);
    setAiLoading(true);

    try {
      const res = await fetch('/api/ai/matter-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: userMsg,
          matterContext: {
            matterNumber: activeMatter.matterNumber,
            title: activeMatter.title,
            category: activeMatter.category,
            court: activeMatter.court,
            caseNumber: activeMatter.caseNumber,
            parties: `${activeMatter.clientName} v. ${activeMatter.opposingParty}`,
            opposingAdvocate: activeMatter.opposingAdvocate,
            leadAdvocate: activeMatter.leadAdvocateName,
            status: activeMatter.status,
            priority: activeMatter.priority,
            value: activeMatter.estimatedValue,
            nextAction: activeMatter.nextAction,
            nextDeadline: activeMatter.nextDeadline,
            documents: matterDocs.map(d => d.title),
            courtEvents: matterEvents.map(e => `${e.eventType} on ${e.date} (${e.time})`),
            tasks: matterTasks.map(t => `${t.title} [${t.status}]`)
          }
        })
      });

      const data = await res.json();
      setAiConversation(prev => [
        ...prev, 
        { sender: 'ai', text: data.response || 'Analysis complete. Procedural posture is aligned with legal rules.' }
      ]);
    } catch (err: any) {
      setAiConversation(prev => [
        ...prev, 
        { sender: 'ai', text: 'AI query encountered a temporary issue. Please verify connection.' }
      ]);
    } finally {
      setAiLoading(false);
    }
  };

  const categories: MatterCategory[] = [
    'Civil litigation', 'Commercial', 'Employment', 'Conveyancing', 'Land', 
    'Succession', 'Debt recovery', 'Family', 'Criminal', 'Corporate'
  ];

  return (
    <div className="space-y-6">
      {/* Top Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-amber-400" />
            Matter & Case Management
          </h1>
          <p className="text-xs text-slate-400">
            Digital case files, court numbers, assigned advocates, pleadings, and procedural timelines
          </p>
        </div>

        <button
          onClick={onOpenNewMatter}
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors shadow-sm cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Open New Matter</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row gap-3 items-center justify-between shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search matters by title, case number, court, client, opposing party..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-amber-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-amber-500 cursor-pointer"
          >
            <option value="all">All Practice Areas</option>
            {categories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-amber-500 cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Hearing Scheduled">Hearing Scheduled</option>
            <option value="Pleadings">Pleadings</option>
            <option value="In Conveyancing">In Conveyancing</option>
            <option value="Discovery">Discovery</option>
            <option value="Pending Ruling">Pending Ruling</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
      </div>

      {/* Main Two-Column View: Matters Directory & Detailed Matter File */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Matters List (4 cols) */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm flex flex-col max-h-[820px]">
          <div className="p-3 bg-slate-850 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold uppercase tracking-wider text-[11px]">Matters Docket</span>
            <span>{filteredMatters.length} files</span>
          </div>

          <div className="overflow-y-auto divide-y divide-slate-800/80 flex-1">
            {filteredMatters.map(m => {
              const isSelected = activeMatter?.id === m.id;
              return (
                <div
                  key={m.id}
                  onClick={() => setSelectedMatterId(m.id)}
                  className={`p-3.5 transition-all cursor-pointer flex flex-col gap-1.5 ${
                    isSelected ? 'bg-amber-500/10 border-l-4 border-amber-400' : 'hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-amber-300 font-bold border border-slate-700">
                      {m.matterNumber}
                    </span>
                    <span className={`text-[9px] font-bold uppercase px-1.5 py-0.2 rounded border ${
                      m.priority === 'Urgent' 
                        ? 'bg-rose-500/15 text-rose-300 border-rose-500/30' 
                        : m.priority === 'High'
                        ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}>
                      {m.priority}
                    </span>
                  </div>

                  <p className="text-xs font-bold text-white line-clamp-1">{m.title}</p>
                  
                  <p className="text-[11px] text-slate-400 truncate">
                    Court: {m.court}
                  </p>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                    <span className="text-slate-300 font-medium">{m.clientName}</span>
                    <span className="font-mono text-emerald-400 font-semibold">{formatKSh(m.estimatedValue)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Matter Dossier (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {activeMatter ? (
            <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-sm overflow-hidden">
              {/* Matter File Header Banner */}
              <div className="p-5 border-b border-slate-800 bg-slate-900/90 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      {activeMatter.matterNumber}
                    </span>
                    <span className="text-xs font-medium text-slate-400">• Opened {activeMatter.dateOpened}</span>
                  </div>

                  <span className={`text-xs font-bold font-mono px-2.5 py-0.5 rounded-full border self-start sm:self-auto ${
                    activeMatter.status === 'Hearing Scheduled'
                      ? 'bg-rose-500/15 text-rose-300 border-rose-500/30 animate-pulse'
                      : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                  }`}>
                    {activeMatter.status}
                  </span>
                </div>

                <h2 className="text-lg font-bold text-white leading-snug">
                  {activeMatter.title}
                </h2>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs pt-1">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Practice Category</span>
                    <span className="text-amber-300 font-medium">{activeMatter.category}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Case Reference</span>
                    <span className="text-white font-mono">{activeMatter.caseNumber}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Lead Advocate</span>
                    <span className="text-white">{activeMatter.leadAdvocateName}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Matter Value</span>
                    <span className="text-emerald-400 font-mono font-bold">{formatKSh(activeMatter.estimatedValue)}</span>
                  </div>
                </div>
              </div>

              {/* Dossier Tabs Navigation */}
              <div className="px-4 border-b border-slate-800 bg-slate-950/60 flex items-center gap-2 overflow-x-auto text-xs">
                {[
                  { id: 'overview', label: 'Overview & Parties', icon: Scale },
                  { id: 'documents', label: `Digital Documents (${matterDocs.length})`, icon: FolderOpen },
                  { id: 'court', label: `Court Diary (${matterEvents.length})`, icon: Calendar },
                  { id: 'tasks', label: `Tasks (${matterTasks.length})`, icon: CheckSquare },
                  { id: 'billing', label: `Fee Notes (${matterInvoices.length})`, icon: Receipt },
                  { id: 'comms', label: `Communications (${matterComms.length})`, icon: MessageSquare },
                  { id: 'ai', label: 'AI Case Assistant', icon: Sparkles }
                ].map(tab => {
                  const Icon = tab.icon;
                  const isActive = activeDossierTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveDossierTab(tab.id as any)}
                      className={`py-3 px-3 flex items-center gap-2 font-medium border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                        isActive
                          ? 'border-amber-400 text-amber-300 font-semibold'
                          : 'border-transparent text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Tab Contents */}
              <div className="p-5">
                {/* 1. OVERVIEW & PARTIES */}
                {activeDossierTab === 'overview' && (
                  <div className="space-y-5">
                    {/* Next Action Box */}
                    <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 via-slate-800/60 to-slate-800/40 border border-amber-500/30 flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-amber-400" />
                          <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                            Immediate Next Action & Procedural Step
                          </span>
                        </div>
                        <p className="text-sm font-semibold text-white mt-1">
                          {activeMatter.nextAction}
                        </p>
                        <p className="text-xs text-slate-400 font-mono mt-1">
                          Statutory / Filing Deadline: <strong className="text-amber-300">{activeMatter.nextDeadline}</strong>
                        </p>
                      </div>

                      <button
                        onClick={() => onOpenNewCourtEvent(activeMatter.id)}
                        className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 shrink-0 cursor-pointer"
                      >
                        Docket in Diary
                      </button>
                    </div>

                    {/* Parties Particulars */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-800 space-y-2">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                          Instructing Client (Claimant / Applicant)
                        </span>
                        <p className="text-sm font-bold text-white">{activeMatter.clientName}</p>
                        <p className="text-slate-400">Lead Counsel: <strong className="text-slate-200">{activeMatter.leadAdvocateName}</strong></p>
                        <p className="text-slate-400">Assigned Clerk: <strong className="text-slate-200">{activeMatter.assignedClerkName}</strong></p>
                      </div>

                      <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-800 space-y-2">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                          Adverse Party (Respondent / Defendant)
                        </span>
                        <p className="text-sm font-bold text-white">{activeMatter.opposingParty}</p>
                        <p className="text-slate-400">Opposing Advocates: <strong className="text-amber-300">{activeMatter.opposingAdvocate}</strong></p>
                        <p className="text-slate-400">Court Registry: <strong className="text-slate-200">{activeMatter.court}</strong></p>
                      </div>
                    </div>

                    {/* Case Notes */}
                    {activeMatter.notes && (
                      <div className="p-4 rounded-xl bg-slate-850 border border-slate-800">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Confidential Internal Notes</h4>
                        <p className="text-xs text-slate-300 leading-relaxed">{activeMatter.notes}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* 2. DIGITAL DOCUMENTS */}
                {activeDossierTab === 'documents' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400 font-semibold">
                        Digital matter archive with Pleadings, Evidence, Court Orders & Agreements
                      </span>
                      <button
                        onClick={() => onOpenNewDocument(activeMatter.id)}
                        className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center gap-1.5 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Upload Legal Document</span>
                      </button>
                    </div>

                    <div className="space-y-2">
                      {matterDocs.map(doc => (
                        <div
                          key={doc.id}
                          className="p-3.5 rounded-lg bg-slate-800/50 border border-slate-700/60 hover:bg-slate-800 transition-all flex items-center justify-between gap-3"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 shrink-0">
                              <FileText className="w-4 h-4" />
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="text-xs font-bold text-white truncate">{doc.title}</p>
                                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-700 text-slate-300">
                                  {doc.version}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                                {doc.fileName} • {doc.fileSize} • {doc.category} • Uploaded by {doc.uploadedBy}
                              </p>
                            </div>
                          </div>

                          <button
                            onClick={() => setActiveTab('documents')}
                            className="px-2.5 py-1 text-xs rounded bg-slate-700 hover:bg-slate-600 text-slate-200 transition-colors shrink-0"
                          >
                            Inspect & Run AI Analysis
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. COURT DIARY */}
                {activeDossierTab === 'court' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400 font-semibold">
                        Scheduled mentions, hearings, rulings and judgments for this matter
                      </span>
                      <button
                        onClick={() => onOpenNewCourtEvent(activeMatter.id)}
                        className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center gap-1.5 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Docket Court Event</span>
                      </button>
                    </div>

                    {matterEvents.length === 0 ? (
                      <div className="p-6 text-center text-xs text-slate-400 bg-slate-800/30 rounded-xl border border-slate-800">
                        No upcoming court events scheduled for this case yet.
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {matterEvents.map(evt => (
                          <div
                            key={evt.id}
                            className={`p-3.5 rounded-lg border flex items-center justify-between gap-3 ${
                              evt.eventType === 'Hearing' && evt.date === '2026-09-29'
                                ? 'bg-rose-950/30 border-rose-500/40 text-rose-200'
                                : 'bg-slate-800/50 border-slate-700/60 text-slate-300'
                            }`}
                          >
                            <div>
                              <div className="flex items-center gap-2">
                                <span className={`text-[10px] font-bold uppercase font-mono px-2 py-0.5 rounded ${
                                  evt.eventType === 'Hearing' ? 'bg-rose-500 text-white' : 'bg-blue-500 text-white'
                                }`}>
                                  {evt.eventType}
                                </span>
                                <span className="text-xs font-bold text-white font-mono">
                                  {evt.date} at {evt.time}
                                </span>
                              </div>
                              <p className="text-xs text-slate-300 mt-1">
                                {evt.court} {evt.courtRoom ? `(${evt.courtRoom})` : ''}
                              </p>
                              {evt.judgeName && (
                                <p className="text-[11px] text-amber-300 mt-0.5">
                                  Before: {evt.judgeName} • Advocate: {evt.advocateAssigned}
                                </p>
                              )}
                            </div>

                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                              {evt.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* 4. TASKS */}
                {activeDossierTab === 'tasks' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400 font-semibold">
                        Assigned actions for advocates, legal clerks, and registry filing
                      </span>
                      <button
                        onClick={() => setActiveTab('tasks')}
                        className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center gap-1.5 cursor-pointer"
                      >
                        <CheckSquare className="w-3.5 h-3.5" />
                        <span>Manage Kanban Tasks</span>
                      </button>
                    </div>

                    <div className="space-y-2">
                      {matterTasks.map(tsk => (
                        <div
                          key={tsk.id}
                          className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/60 flex items-center justify-between gap-3 text-xs"
                        >
                          <div>
                            <p className="font-semibold text-white">{tsk.title}</p>
                            <p className="text-[11px] text-slate-400 mt-0.5">
                              Assigned: {tsk.assignedToName} ({tsk.assignedRole}) • Due: <strong className="text-amber-300">{tsk.deadline}</strong>
                            </p>
                          </div>
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-bold ${
                            tsk.status === 'Complete' 
                              ? 'bg-emerald-500/20 text-emerald-400' 
                              : 'bg-amber-500/20 text-amber-400'
                          }`}>
                            {tsk.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 5. BILLING */}
                {activeDossierTab === 'billing' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400 font-semibold">
                        Fee notes, disbursements, VAT & payment receipts
                      </span>
                      <button
                        onClick={() => setActiveTab('billing')}
                        className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center gap-1.5 cursor-pointer"
                      >
                        <Receipt className="w-3.5 h-3.5" />
                        <span>Billing & Invoices Hub</span>
                      </button>
                    </div>

                    {matterInvoices.map(inv => (
                      <div
                        key={inv.id}
                        className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/60 flex items-center justify-between gap-4 text-xs"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white font-mono text-sm">{inv.invoiceNumber}</span>
                            <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                              inv.status === 'Paid' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                            }`}>
                              {inv.status}
                            </span>
                          </div>
                          <p className="text-slate-400 mt-1">Issued: {inv.dateIssued} • Due: {inv.dueDate}</p>
                          <p className="text-[11px] text-slate-300 mt-1">
                            {inv.items.length} items (Professional Fees & Disbursements)
                          </p>
                        </div>

                        <div className="text-right">
                          <span className="text-sm font-bold text-emerald-400 font-mono block">
                            {formatKSh(inv.totalAmount)}
                          </span>
                          {inv.balanceDue > 0 ? (
                            <span className="text-xs text-rose-400 font-mono block">
                              Bal Due: {formatKSh(inv.balanceDue)}
                            </span>
                          ) : (
                            <span className="text-[11px] text-emerald-400 font-semibold block">Settled in Full</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* 6. COMMUNICATIONS */}
                {activeDossierTab === 'comms' && (
                  <div className="space-y-4">
                    <span className="text-xs text-slate-400 font-semibold block">
                      Chronological communication records (Phone, Email, WhatsApp, Client Conferences)
                    </span>

                    <div className="space-y-2.5">
                      {matterComms.map(comm => (
                        <div
                          key={comm.id}
                          className="p-3.5 rounded-lg bg-slate-800/40 border border-slate-700/60 text-xs space-y-1.5"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-amber-300 font-bold px-2 py-0.5 rounded bg-slate-800">
                              {comm.type} • {comm.date} at {comm.time}
                            </span>
                            <span className="text-slate-400">{comm.sender} → {comm.recipient}</span>
                          </div>
                          <p className="text-slate-200 leading-relaxed">{comm.summary}</p>
                          {comm.actionRequired && (
                            <p className="text-[11px] text-amber-400 font-semibold">
                              Action Required: {comm.actionRequired}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 7. AI CASE ASSISTANT */}
                {activeDossierTab === 'ai' && (
                  <div className="space-y-4">
                    <div className="p-3 bg-purple-950/20 border border-purple-500/30 rounded-xl flex items-center justify-between gap-3 text-xs text-purple-200">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-purple-400" />
                        <span>Grounded in active matter records, court deadlines, and Kenyan procedural rules.</span>
                      </div>
                      <span className="font-mono font-bold text-purple-300">Gemini 3.8 Flash</span>
                    </div>

                    {/* Chat Messages */}
                    <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl min-h-[220px] max-h-[380px] overflow-y-auto space-y-3">
                      {aiConversation.map((msg, idx) => (
                        <div
                          key={idx}
                          className={`flex items-start gap-2.5 text-xs ${
                            msg.sender === 'user' ? 'justify-end' : 'justify-start'
                          }`}
                        >
                          {msg.sender === 'ai' && (
                            <div className="w-6 h-6 rounded-lg bg-purple-600 flex items-center justify-center text-white shrink-0 mt-0.5">
                              <Sparkles className="w-3.5 h-3.5" />
                            </div>
                          )}
                          <div
                            className={`p-3 rounded-xl max-w-[85%] leading-relaxed ${
                              msg.sender === 'user'
                                ? 'bg-amber-500 text-slate-950 font-medium'
                                : 'bg-slate-800/80 text-slate-200 border border-slate-700/60 whitespace-pre-wrap'
                            }`}
                          >
                            {msg.text}
                          </div>
                        </div>
                      ))}

                      {aiLoading && (
                        <div className="flex items-center gap-2 text-xs text-purple-400">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>LexisFirm AI analyzing matter dossier...</span>
                        </div>
                      )}
                    </div>

                    {/* Prompt input */}
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Ask: 'What documents are missing?' or 'What are the risks at hearing tomorrow?'"
                        value={aiPrompt}
                        onChange={(e) => setAiPrompt(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAskAi()}
                        className="flex-1 px-4 py-2.5 text-xs bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-purple-500"
                      />
                      <button
                        onClick={handleAskAi}
                        disabled={aiLoading || !aiPrompt.trim()}
                        className="px-4 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Query</span>
                      </button>
                    </div>

                    {/* Quick suggestion chips */}
                    <div className="flex flex-wrap gap-2 text-[11px]">
                      <button
                        onClick={() => { setAiPrompt('What documents are missing from this matter file before hearing?'); }}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 cursor-pointer"
                      >
                        🔍 Missing documents check
                      </button>
                      <button
                        onClick={() => { setAiPrompt('Evaluate witness cross-examination strategies for opposing counsel.'); }}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 cursor-pointer"
                      >
                        ⚖️ Cross-examination strategy
                      </button>
                      <button
                        onClick={() => { setAiPrompt('Draft a concise update SMS for the client managing director.'); }}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 cursor-pointer"
                      >
                        📱 Client update draft
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-slate-400 bg-slate-900 border border-slate-800 rounded-xl">
              Select a matter from the docket list.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
