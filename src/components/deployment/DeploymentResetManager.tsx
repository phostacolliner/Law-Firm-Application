import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Server,
  RotateCcw,
  Camera,
  Download,
  Upload,
  Activity,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  Sparkles,
  Layers,
  ArrowRight,
  Database,
  Building,
  Lock,
  Calendar,
  Briefcase,
  Users,
  Receipt,
  Landmark,
  Timer,
  FolderOpen,
  Info,
  Clock,
  RefreshCw,
  FileCheck,
  Check,
  X
} from 'lucide-react';
import { DEPLOYMENT_TEMPLATES } from '../../data/deploymentPresets';
import { ResetScope, DeploymentEnvironment } from '../../types';

export const DeploymentResetManager: React.FC = () => {
  const {
    firmProfile,
    updateFirmProfile,
    snapshots,
    createSnapshot,
    restoreSnapshot,
    deleteSnapshot,
    deployPreset,
    executeSelectiveReset,
    runIntegrityDiagnostics,
    exportDatabaseJson,
    importDatabaseJson,
    clients,
    matters,
    courtEvents,
    documents,
    tasks,
    invoices,
    trustTransactions,
    officeExpenses,
    timeEntries,
    formatKSh
  } = useApp();

  const [activeTab, setActiveTab] = useState<'templates' | 'selective_reset' | 'snapshots' | 'profile' | 'diagnostics'>('templates');

  // Selective Reset State
  const [resetScope, setResetScope] = useState<ResetScope>({
    clients: false,
    matters: false,
    courtDiary: true,
    documents: false,
    tasks: true,
    invoicesAndReceipts: false,
    trustLedger: false,
    officeExpenses: false,
    timeEntries: true,
    communications: false,
    workflowProgress: false,
    auditLogs: false
  });

  const [confirmPhrase, setConfirmPhrase] = useState('');
  const [partnerPin, setPartnerPin] = useState('');
  const [resetMemo, setResetMemo] = useState('Routine Practice Reset / Term Rollover');
  const [resetSuccessMessage, setResetSuccessMessage] = useState<string | null>(null);
  const [resetErrorMessage, setResetErrorMessage] = useState<string | null>(null);

  // Snapshot Creation State
  const [snapshotName, setSnapshotName] = useState('');
  const [snapshotMemo, setSnapshotMemo] = useState('');
  const [snapshotSuccessMessage, setSnapshotSuccessMessage] = useState<string | null>(null);

  // Profile Edit State
  const [profileForm, setProfileForm] = useState(firmProfile);
  const [profileSuccessMessage, setProfileSuccessMessage] = useState<string | null>(null);

  // Import State
  const [importStatus, setImportStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Diagnostics State
  const [diagnosticReport, setDiagnosticReport] = useState(() => runIntegrityDiagnostics());

  // Handle preset deployment
  const handleDeployTemplate = (templateId: string, templateName: string) => {
    if (window.confirm(`Deploy "${templateName}"?\n\nA safety snapshot will be automatically recorded before deploying.`)) {
      const ok = deployPreset(templateId);
      if (ok) {
        setResetSuccessMessage(`Successfully deployed template: "${templateName}". Environment updated to ${firmProfile.environment}.`);
        setTimeout(() => setResetSuccessMessage(null), 6000);
      }
    }
  };

  // Handle selective reset
  const handleExecuteReset = (e: React.FormEvent) => {
    e.preventDefault();
    setResetErrorMessage(null);
    setResetSuccessMessage(null);

    const targetPhrase = 'CONFIRM-RESET';
    if (confirmPhrase.trim().toUpperCase() !== targetPhrase) {
      setResetErrorMessage(`Security confirmation phrase failed. Please type exactly "${targetPhrase}".`);
      return;
    }

    if (partnerPin.trim() !== '2026' && partnerPin.trim() !== '0000') {
      setResetErrorMessage('Invalid Senior Counsel / Managing Partner authorization PIN. Default PIN is 2026.');
      return;
    }

    const anySelected = Object.values(resetScope).some(Boolean);
    if (!anySelected) {
      setResetErrorMessage('Please select at least one practice domain to reset.');
      return;
    }

    const success = executeSelectiveReset(resetScope, {
      confirmPhrase,
      memo: resetMemo
    });

    if (success) {
      setResetSuccessMessage('Selective reset executed successfully. Automated backup snapshot was captured.');
      setConfirmPhrase('');
      setPartnerPin('');
      setDiagnosticReport(runIntegrityDiagnostics());
      setTimeout(() => setResetSuccessMessage(null), 7000);
    } else {
      setResetErrorMessage('Reset execution aborted.');
    }
  };

  // Handle new snapshot
  const handleCreateSnapshot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!snapshotName.trim()) return;

    createSnapshot(snapshotName, snapshotMemo, false);
    setSnapshotSuccessMessage(`Created recovery snapshot: "${snapshotName}"`);
    setSnapshotName('');
    setSnapshotMemo('');
    setTimeout(() => setSnapshotSuccessMessage(null), 5000);
  };

  // Handle export JSON
  const handleExportJson = () => {
    const jsonStr = exportDatabaseJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lexisfirm_backup_${firmProfile.environment}_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Handle file import
  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const res = importDatabaseJson(content);
      if (res.success) {
        setImportStatus({ type: 'success', message: res.message });
        setDiagnosticReport(runIntegrityDiagnostics());
      } else {
        setImportStatus({ type: 'error', message: res.message });
      }
      setTimeout(() => setImportStatus(null), 6000);
    };
    reader.readAsText(file);
    // Reset file input
    event.target.value = '';
  };

  // Handle profile save
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateFirmProfile(profileForm);
    setProfileSuccessMessage('Firm deployment profile & statutory banking particulars updated successfully.');
    setTimeout(() => setProfileSuccessMessage(null), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Control Deck */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Server className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white flex items-center gap-2.5">
                  Deployment & Reset System
                  <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                    firmProfile.environment === 'production'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : firmProfile.environment === 'staging'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                  }`}>
                    {firmProfile.environment}
                  </span>
                </h1>
                <p className="text-xs text-slate-400 mt-0.5">
                  Enterprise practice provisioning, granular selective resets, automated recovery snapshots, and statutory health audits.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Action Badges */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleExportJson}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              <span>Export Database (JSON)</span>
            </button>

            <label className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors cursor-pointer">
              <Upload className="w-3.5 h-3.5 text-indigo-400" />
              <span>Import Backup</span>
              <input type="file" accept=".json" onChange={handleFileImport} className="hidden" />
            </label>

            <button
              onClick={() => {
                setDiagnosticReport(runIntegrityDiagnostics());
                setActiveTab('diagnostics');
              }}
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 text-xs font-semibold border border-emerald-500/30 transition-colors cursor-pointer"
            >
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              <span>Health Score: {diagnosticReport.healthScore}%</span>
            </button>
          </div>
        </div>

        {/* Global Notifications */}
        {resetSuccessMessage && (
          <div className="mt-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{resetSuccessMessage}</span>
          </div>
        )}
        {resetErrorMessage && (
          <div className="mt-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{resetErrorMessage}</span>
          </div>
        )}
        {importStatus && (
          <div className={`mt-4 p-3 rounded-lg text-xs flex items-center gap-2 ${
            importStatus.type === 'success' 
              ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
              : 'bg-rose-500/10 border border-rose-500/30 text-rose-300'
          }`}>
            {importStatus.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
            <span>{importStatus.message}</span>
          </div>
        )}

        {/* Practice Live Metadata bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 mt-5 pt-5 border-t border-slate-800 text-xs">
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Firm Entity</span>
            <span className="font-semibold text-white truncate block">{firmProfile.firmName}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">LSK Reg No</span>
            <span className="font-mono text-amber-300 font-medium block">{firmProfile.lskFirmNumber}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Active Matters</span>
            <span className="font-bold text-white block">{matters.length} cases</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Client Base</span>
            <span className="font-bold text-white block">{clients.length} clients</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Trust Account</span>
            <span className="font-mono text-slate-300 truncate block">{firmProfile.trustBankName.split(' ')[0]}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Snapshots</span>
            <span className="font-bold text-indigo-300 block">{snapshots.length} recovery points</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-800 gap-2 overflow-x-auto pb-px">
        <button
          onClick={() => setActiveTab('templates')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-lg transition-all cursor-pointer ${
            activeTab === 'templates'
              ? 'bg-slate-900 text-amber-400 border-t-2 border-amber-500 border-x border-slate-800'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Deployment Templates & Presets</span>
        </button>

        <button
          onClick={() => setActiveTab('selective_reset')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-lg transition-all cursor-pointer ${
            activeTab === 'selective_reset'
              ? 'bg-slate-900 text-amber-400 border-t-2 border-amber-500 border-x border-slate-800'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <RotateCcw className="w-4 h-4" />
          <span>Selective Reset Engine</span>
        </button>

        <button
          onClick={() => setActiveTab('snapshots')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-lg transition-all cursor-pointer ${
            activeTab === 'snapshots'
              ? 'bg-slate-900 text-amber-400 border-t-2 border-amber-500 border-x border-slate-800'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Camera className="w-4 h-4" />
          <span>Snapshots & Disaster Recovery ({snapshots.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-lg transition-all cursor-pointer ${
            activeTab === 'profile'
              ? 'bg-slate-900 text-amber-400 border-t-2 border-amber-500 border-x border-slate-800'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Building className="w-4 h-4" />
          <span>Firm Profile & Environments</span>
        </button>

        <button
          onClick={() => {
            setDiagnosticReport(runIntegrityDiagnostics());
            setActiveTab('diagnostics');
          }}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-lg transition-all cursor-pointer ${
            activeTab === 'diagnostics'
              ? 'bg-slate-900 text-amber-400 border-t-2 border-amber-500 border-x border-slate-800'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Integrity Diagnostics</span>
        </button>
      </div>

      {/* TAB 1: DEPLOYMENT TEMPLATES */}
      {activeTab === 'templates' && (
        <div className="space-y-6">
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex items-start gap-3">
            <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-300 leading-relaxed">
              <p className="font-semibold text-white">Controlled Environment Seeding vs Raw Deletion</p>
              <p className="mt-0.5 text-slate-400">
                Instead of executing destructive SQL drops or wiping system files, deployment templates allow law firm administrators to instantly transition between practice specializations or deploy a bare, production-ready slate. A rollback snapshot is captured automatically before any template is applied.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {DEPLOYMENT_TEMPLATES.map((tpl) => (
              <div
                key={tpl.id}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-5 flex flex-col justify-between transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                      tpl.id === 'clean_production'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : tpl.id === 'commercial_boutique'
                        ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}>
                      {tpl.badge}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      Target: {tpl.environmentTarget.toUpperCase()}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                    {tpl.name}
                  </h3>

                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    {tpl.description}
                  </p>

                  {/* Seed Statistics */}
                  <div className="grid grid-cols-4 gap-2 mt-4 p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 text-center text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Matters</span>
                      <span className="font-bold text-white">{tpl.stats.matters}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Clients</span>
                      <span className="font-bold text-white">{tpl.stats.clients}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Courts</span>
                      <span className="font-bold text-white">{tpl.stats.courtEvents}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Invoices</span>
                      <span className="font-bold text-white">{tpl.stats.invoices}</span>
                    </div>
                  </div>

                  <div className="mt-3 text-[11px] text-slate-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span><strong className="text-slate-300">Best for:</strong> {tpl.recommendedFor}</span>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between">
                  <div className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Auto-snapshots current data</span>
                  </div>

                  <button
                    onClick={() => handleDeployTemplate(tpl.id, tpl.name)}
                    className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all shadow-md cursor-pointer"
                  >
                    <span>Deploy Preset</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: SELECTIVE GRANULAR RESET ENGINE */}
      {activeTab === 'selective_reset' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">Granular Practice Reset Controller</h2>
                <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
                  Unlike traditional systems that blindly erase all records, LFMS provides surgical domain-level reset controls. Select exactly which modules to flush (e.g. court diary for court vacation, or unbilled time for a new cycle) while preserving statutory records, advocate credentials, and fee agreements.
                </p>
              </div>
            </div>

            <form onSubmit={handleExecuteReset} className="mt-6 space-y-6">
              {/* Domain Selector Grid */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    1. Select Practice Domains to Flush
                  </span>
                  <div className="flex gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setResetScope({
                        clients: true, matters: true, courtDiary: true, documents: true,
                        tasks: true, invoicesAndReceipts: true, trustLedger: true,
                        officeExpenses: true, timeEntries: true, communications: true,
                        workflowProgress: true, auditLogs: false
                      })}
                      className="text-amber-400 hover:underline cursor-pointer"
                    >
                      Select All Demo Data
                    </button>
                    <span className="text-slate-600">|</span>
                    <button
                      type="button"
                      onClick={() => setResetScope({
                        clients: false, matters: false, courtDiary: false, documents: false,
                        tasks: false, invoicesAndReceipts: false, trustLedger: false,
                        officeExpenses: false, timeEntries: false, communications: false,
                        workflowProgress: false, auditLogs: false
                      })}
                      className="text-slate-400 hover:underline cursor-pointer"
                    >
                      Clear Selection
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {/* Court Diary */}
                  <label className={`p-3.5 rounded-lg border flex items-start gap-3 cursor-pointer transition-all ${
                    resetScope.courtDiary
                      ? 'bg-rose-500/10 border-rose-500/40 text-rose-200'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-900'
                  }`}>
                    <input
                      type="checkbox"
                      checked={resetScope.courtDiary}
                      onChange={(e) => setResetScope(prev => ({ ...prev, courtDiary: e.target.checked }))}
                      className="mt-0.5 rounded border-slate-700 text-rose-500 focus:ring-0"
                    />
                    <div>
                      <div className="flex items-center gap-2 font-semibold text-xs text-white">
                        <Calendar className="w-3.5 h-3.5 text-rose-400" />
                        <span>Court Diary & Cause List</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Current: <strong className="text-slate-200">{courtEvents.length}</strong> court hearings, mentions & deadlines.
                      </p>
                    </div>
                  </label>

                  {/* Tasks & Milestones */}
                  <label className={`p-3.5 rounded-lg border flex items-start gap-3 cursor-pointer transition-all ${
                    resetScope.tasks
                      ? 'bg-rose-500/10 border-rose-500/40 text-rose-200'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-900'
                  }`}>
                    <input
                      type="checkbox"
                      checked={resetScope.tasks}
                      onChange={(e) => setResetScope(prev => ({ ...prev, tasks: e.target.checked }))}
                      className="mt-0.5 rounded border-slate-700 text-rose-500 focus:ring-0"
                    />
                    <div>
                      <div className="flex items-center gap-2 font-semibold text-xs text-white">
                        <FileCheck className="w-3.5 h-3.5 text-amber-400" />
                        <span>Practice Tasks & Kanbans</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Current: <strong className="text-slate-200">{tasks.length}</strong> associate & clerk assignments.
                      </p>
                    </div>
                  </label>

                  {/* Time Entries */}
                  <label className={`p-3.5 rounded-lg border flex items-start gap-3 cursor-pointer transition-all ${
                    resetScope.timeEntries
                      ? 'bg-rose-500/10 border-rose-500/40 text-rose-200'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-900'
                  }`}>
                    <input
                      type="checkbox"
                      checked={resetScope.timeEntries}
                      onChange={(e) => setResetScope(prev => ({ ...prev, timeEntries: e.target.checked }))}
                      className="mt-0.5 rounded border-slate-700 text-rose-500 focus:ring-0"
                    />
                    <div>
                      <div className="flex items-center gap-2 font-semibold text-xs text-white">
                        <Timer className="w-3.5 h-3.5 text-blue-400" />
                        <span>Billable Time Logs</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Current: <strong className="text-slate-200">{timeEntries.length}</strong> recorded advocate hours.
                      </p>
                    </div>
                  </label>

                  {/* Matters / Cases */}
                  <label className={`p-3.5 rounded-lg border flex items-start gap-3 cursor-pointer transition-all ${
                    resetScope.matters
                      ? 'bg-rose-500/10 border-rose-500/40 text-rose-200'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-900'
                  }`}>
                    <input
                      type="checkbox"
                      checked={resetScope.matters}
                      onChange={(e) => setResetScope(prev => ({ ...prev, matters: e.target.checked }))}
                      className="mt-0.5 rounded border-slate-700 text-rose-500 focus:ring-0"
                    />
                    <div>
                      <div className="flex items-center gap-2 font-semibold text-xs text-white">
                        <Briefcase className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Case Matters & Pleadings</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Current: <strong className="text-slate-200">{matters.length}</strong> active & pending cases.
                      </p>
                    </div>
                  </label>

                  {/* Client CRM */}
                  <label className={`p-3.5 rounded-lg border flex items-start gap-3 cursor-pointer transition-all ${
                    resetScope.clients
                      ? 'bg-rose-500/10 border-rose-500/40 text-rose-200'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-900'
                  }`}>
                    <input
                      type="checkbox"
                      checked={resetScope.clients}
                      onChange={(e) => setResetScope(prev => ({ ...prev, clients: e.target.checked }))}
                      className="mt-0.5 rounded border-slate-700 text-rose-500 focus:ring-0"
                    />
                    <div>
                      <div className="flex items-center gap-2 font-semibold text-xs text-white">
                        <Users className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Client CRM Directory</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Current: <strong className="text-slate-200">{clients.length}</strong> corporate & individual profiles.
                      </p>
                    </div>
                  </label>

                  {/* Invoices & Receipts */}
                  <label className={`p-3.5 rounded-lg border flex items-start gap-3 cursor-pointer transition-all ${
                    resetScope.invoicesAndReceipts
                      ? 'bg-rose-500/10 border-rose-500/40 text-rose-200'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-900'
                  }`}>
                    <input
                      type="checkbox"
                      checked={resetScope.invoicesAndReceipts}
                      onChange={(e) => setResetScope(prev => ({ ...prev, invoicesAndReceipts: e.target.checked }))}
                      className="mt-0.5 rounded border-slate-700 text-rose-500 focus:ring-0"
                    />
                    <div>
                      <div className="flex items-center gap-2 font-semibold text-xs text-white">
                        <Receipt className="w-3.5 h-3.5 text-amber-400" />
                        <span>Invoices & Fee Notes</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Current: <strong className="text-slate-200">{invoices.length}</strong> fee notes & payment receipts.
                      </p>
                    </div>
                  </label>

                  {/* Trust Account Ledger */}
                  <label className={`p-3.5 rounded-lg border flex items-start gap-3 cursor-pointer transition-all ${
                    resetScope.trustLedger
                      ? 'bg-rose-500/10 border-rose-500/40 text-rose-200'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-900'
                  }`}>
                    <input
                      type="checkbox"
                      checked={resetScope.trustLedger}
                      onChange={(e) => setResetScope(prev => ({ ...prev, trustLedger: e.target.checked }))}
                      className="mt-0.5 rounded border-slate-700 text-rose-500 focus:ring-0"
                    />
                    <div>
                      <div className="flex items-center gap-2 font-semibold text-xs text-white">
                        <Landmark className="w-3.5 h-3.5 text-purple-400" />
                        <span>Client Trust Money Ledger</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Current: <strong className="text-slate-200">{trustTransactions.length}</strong> stakeholder deposits.
                      </p>
                    </div>
                  </label>

                  {/* Document Archive */}
                  <label className={`p-3.5 rounded-lg border flex items-start gap-3 cursor-pointer transition-all ${
                    resetScope.documents
                      ? 'bg-rose-500/10 border-rose-500/40 text-rose-200'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-900'
                  }`}>
                    <input
                      type="checkbox"
                      checked={resetScope.documents}
                      onChange={(e) => setResetScope(prev => ({ ...prev, documents: e.target.checked }))}
                      className="mt-0.5 rounded border-slate-700 text-rose-500 focus:ring-0"
                    />
                    <div>
                      <div className="flex items-center gap-2 font-semibold text-xs text-white">
                        <FolderOpen className="w-3.5 h-3.5 text-yellow-400" />
                        <span>Document Vault & Pleadings</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Current: <strong className="text-slate-200">{documents.length}</strong> legal pleadings & deeds.
                      </p>
                    </div>
                  </label>

                  {/* Operating Expenses */}
                  <label className={`p-3.5 rounded-lg border flex items-start gap-3 cursor-pointer transition-all ${
                    resetScope.officeExpenses
                      ? 'bg-rose-500/10 border-rose-500/40 text-rose-200'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-900'
                  }`}>
                    <input
                      type="checkbox"
                      checked={resetScope.officeExpenses}
                      onChange={(e) => setResetScope(prev => ({ ...prev, officeExpenses: e.target.checked }))}
                      className="mt-0.5 rounded border-slate-700 text-rose-500 focus:ring-0"
                    />
                    <div>
                      <div className="flex items-center gap-2 font-semibold text-xs text-white">
                        <Database className="w-3.5 h-3.5 text-teal-400" />
                        <span>Office Operating Expenses</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Current: <strong className="text-slate-200">{officeExpenses.length}</strong> chambers ledger entries.
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Reset Reason & Audit Memo */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  2. Reason for Reset (Recorded to Bar Compliance Audit Log)
                </label>
                <input
                  type="text"
                  value={resetMemo}
                  onChange={(e) => setResetMemo(e.target.value)}
                  placeholder="e.g. End of Trinity Court Term Reset, Ardhisasa migration testing, etc."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Safety Authorization Gate */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/90 space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-400">
                  <Lock className="w-4 h-4" />
                  <span>3. Senior Counsel Safety Verification Gate</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">
                      Type Confirmation Phrase: <code className="text-amber-400 font-mono font-bold">CONFIRM-RESET</code>
                    </label>
                    <input
                      type="text"
                      value={confirmPhrase}
                      onChange={(e) => setConfirmPhrase(e.target.value)}
                      placeholder="CONFIRM-RESET"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white uppercase font-mono tracking-wider focus:outline-none focus:border-rose-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-300 mb-1">
                      Partner Authorization PIN (Default: <code className="text-amber-400 font-mono">2026</code>)
                    </label>
                    <input
                      type="password"
                      value={partnerPin}
                      onChange={(e) => setPartnerPin(e.target.value)}
                      placeholder="••••"
                      maxLength={4}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono tracking-widest focus:outline-none focus:border-rose-500"
                    />
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Camera className="w-4 h-4 shrink-0 text-amber-400" />
                    <span>Auto-Backup Snapshot will be captured prior to flushing selected data.</span>
                  </div>
                  <span className="text-[10px] uppercase font-bold text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded">
                    Zero Data Loss Guarantee
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="submit"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-lg cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Execute Controlled Selective Reset</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TAB 3: SNAPSHOTS & DISASTER RECOVERY */}
      {activeTab === 'snapshots' && (
        <div className="space-y-6">
          {/* Create Snapshot Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Camera className="w-4 h-4 text-amber-400" />
              <span>Create Practice Checkpoint Snapshot</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Capture an exact point-in-time image of the firm's clients, matters, ledgers, and court diaries. You can instantly restore to any snapshot at any time.
            </p>

            <form onSubmit={handleCreateSnapshot} className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <input
                  type="text"
                  value={snapshotName}
                  onChange={(e) => setSnapshotName(e.target.value)}
                  placeholder="Snapshot Name (e.g. Pre-Audit Baseline)"
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <input
                  type="text"
                  value={snapshotMemo}
                  onChange={(e) => setSnapshotMemo(e.target.value)}
                  placeholder="Optional memo / notes"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Take Snapshot Now</span>
                </button>
              </div>
            </form>

            {snapshotSuccessMessage && (
              <div className="mt-3 p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>{snapshotSuccessMessage}</span>
              </div>
            )}
          </div>

          {/* Snapshots List */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">Snapshot Recovery Archive</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Point-in-time recovery points available for rollback.
                </p>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                {snapshots.length} snapshots recorded
              </span>
            </div>

            <div className="divide-y divide-slate-800/80">
              {snapshots.map((snap) => (
                <div key={snap.id} className="p-4 hover:bg-slate-800/30 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2.5">
                      <span className="font-bold text-xs text-white">{snap.name}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                        snap.environment === 'production'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : snap.environment === 'staging'
                          ? 'bg-amber-500/20 text-amber-300'
                          : 'bg-purple-500/20 text-purple-300'
                      }`}>
                        {snap.environment}
                      </span>
                      {snap.autoCreated && (
                        <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded border border-slate-700">
                          Auto Pre-Reset
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-400 mt-1">{snap.description}</p>

                    <div className="flex flex-wrap items-center gap-4 mt-2 text-[11px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {new Date(snap.timestamp).toLocaleString('en-KE')}
                      </span>
                      <span><strong>{snap.recordCounts.matters}</strong> Matters</span>
                      <span><strong>{snap.recordCounts.clients}</strong> Clients</span>
                      <span><strong>{snap.recordCounts.courtEvents}</strong> Court Dates</span>
                      <span><strong>{snap.recordCounts.trustTransactions}</strong> Trust Tx</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                    <button
                      onClick={() => {
                        if (window.confirm(`Restore system to snapshot "${snap.name}"?\n\nA backup of current state will be taken first.`)) {
                          restoreSnapshot(snap.id);
                        }
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 text-xs font-semibold border border-emerald-500/30 transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Restore This</span>
                    </button>

                    <button
                      onClick={() => {
                        const blob = new Blob([JSON.stringify(snap, null, 2)], { type: 'application/json' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `snapshot_${snap.id}.json`;
                        a.click();
                        URL.revokeObjectURL(url);
                      }}
                      title="Download snapshot JSON"
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>

                    {snapshots.length > 1 && (
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete snapshot "${snap.name}"?`)) {
                            deleteSnapshot(snap.id);
                          }
                        }}
                        title="Delete snapshot"
                        className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: FIRM PROFILE & ENVIRONMENTS */}
      {activeTab === 'profile' && (
        <div className="space-y-6">
          <form onSubmit={handleSaveProfile} className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-white">Firm Deployment Profile & Statutory Particulars</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Legal entity registration, statutory banking parameters, and deployment runtime mode.
                </p>
              </div>
              <button
                type="submit"
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Save Profile Changes</span>
              </button>
            </div>

            {profileSuccessMessage && (
              <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>{profileSuccessMessage}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Law Firm Name</label>
                <input
                  type="text"
                  value={profileForm.firmName}
                  onChange={(e) => setProfileForm(prev => ({ ...prev, firmName: e.target.value }))}
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">LSK Firm Registration No</label>
                <input
                  type="text"
                  value={profileForm.lskFirmNumber}
                  onChange={(e) => setProfileForm(prev => ({ ...prev, lskFirmNumber: e.target.value }))}
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Tax PIN (KRA PIN)</label>
                <input
                  type="text"
                  value={profileForm.kraPin}
                  onChange={(e) => setProfileForm(prev => ({ ...prev, kraPin: e.target.value }))}
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Managing Partner / Senior Counsel</label>
                <input
                  type="text"
                  value={profileForm.managingPartner}
                  onChange={(e) => setProfileForm(prev => ({ ...prev, managingPartner: e.target.value }))}
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Deployment Environment</label>
                <select
                  value={profileForm.environment}
                  onChange={(e) => setProfileForm(prev => ({ ...prev, environment: e.target.value as DeploymentEnvironment }))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="production">Production (Real Client Data)</option>
                  <option value="staging">Staging / Sandbox</option>
                  <option value="demo">Demo / Training Mode</option>
                  <option value="fresh_deploy">Fresh Deployment</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Base Currency & VAT Rate</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={profileForm.currency}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, currency: e.target.value }))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white font-mono"
                  />
                  <div className="relative">
                    <input
                      type="number"
                      value={profileForm.vatRate}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, vatRate: Number(e.target.value) }))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white font-mono"
                    />
                    <span className="absolute right-2.5 top-2 text-xs text-slate-400">%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Banking Particulars */}
            <div className="pt-4 border-t border-slate-800">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-3">
                Statutory Advocate Banking Accounts (Advocates Accounts Rules Cap 16)
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-2.5">
                  <span className="text-xs font-bold text-white flex items-center gap-2">
                    <Landmark className="w-3.5 h-3.5 text-purple-400" />
                    <span>Client Trust Account (Strict Statutory Isolation)</span>
                  </span>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-0.5">Trust Bank Name & Branch</label>
                    <input
                      type="text"
                      value={profileForm.trustBankName}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, trustBankName: e.target.value }))}
                      className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-0.5">Trust Account Number</label>
                    <input
                      type="text"
                      value={profileForm.trustAccountNumber}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, trustAccountNumber: e.target.value }))}
                      className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white font-mono"
                    />
                  </div>
                </div>

                <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-2.5">
                  <span className="text-xs font-bold text-white flex items-center gap-2">
                    <Building className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Chambers Operating Office Account</span>
                  </span>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-0.5">Office Bank Name & Branch</label>
                    <input
                      type="text"
                      value={profileForm.officeBankName}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, officeBankName: e.target.value }))}
                      className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-0.5">Office Account Number</label>
                    <input
                      type="text"
                      value={profileForm.officeAccountNumber}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, officeAccountNumber: e.target.value }))}
                      className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* National Integrations */}
            <div className="pt-4 border-t border-slate-800 flex flex-wrap gap-6 text-xs">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={profileForm.ardhisasaEnabled}
                  onChange={(e) => setProfileForm(prev => ({ ...prev, ardhisasaEnabled: e.target.checked }))}
                  className="rounded border-slate-700 text-amber-500 focus:ring-0"
                />
                <span className="text-slate-300">Ardhisasa Ministry of Lands Portal API Integration</span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={profileForm.efilingEnabled}
                  onChange={(e) => setProfileForm(prev => ({ ...prev, efilingEnabled: e.target.checked }))}
                  className="rounded border-slate-700 text-amber-500 focus:ring-0"
                />
                <span className="text-slate-300">Judiciary of Kenya CTS E-Filing Float Sync</span>
              </label>
            </div>
          </form>
        </div>
      )}

      {/* TAB 5: INTEGRITY DIAGNOSTICS */}
      {activeTab === 'diagnostics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg ${
                diagnosticReport.healthScore >= 90
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
              }`}>
                {diagnosticReport.healthScore}%
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Health Score</span>
                <span className="font-bold text-sm text-white">
                  {diagnosticReport.checksPassed} of {diagnosticReport.totalChecks} Checks Passed
                </span>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Trust Account Audit</span>
              <div className="flex items-center gap-2 mt-1">
                {diagnosticReport.trustAccountReconciled ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                )}
                <span className={`text-xs font-bold ${
                  diagnosticReport.trustAccountReconciled ? 'text-emerald-300' : 'text-rose-300'
                }`}>
                  {diagnosticReport.trustAccountReconciled ? 'Reconciled & Statutory Compliant' : 'Discrepancy Detected'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Ledger Balance: {formatKSh(diagnosticReport.trustLedgerTotal)}
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Storage Footprint</span>
              <span className="font-bold text-sm text-white block mt-1">
                ~{diagnosticReport.totalStorageEstimateKb} KB local JSON
              </span>
              <p className="text-[11px] text-slate-400 mt-1">
                Unbilled Advocate Hours: {diagnosticReport.unbilledHoursCount} hrs ({formatKSh(diagnosticReport.unbilledHoursValue)})
              </p>
            </div>
          </div>

          {/* Diagnostic Checks & Issues List */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">Automated Statutory & Practice Health Audit</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Verified as of {new Date(diagnosticReport.timestamp).toLocaleTimeString('en-KE')}
                </p>
              </div>
              <button
                onClick={() => setDiagnosticReport(runIntegrityDiagnostics())}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 cursor-pointer"
              >
                <RefreshCw className="w-3 h-3 text-amber-400" />
                <span>Re-Scan Now</span>
              </button>
            </div>

            {diagnosticReport.issues.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
                <p className="text-sm font-bold text-white">All Practice Integrity Checks Passed</p>
                <p className="text-xs text-slate-400 mt-1">
                  Zero orphaned matters, court dates properly staffed, trust ledger reconciled.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-800">
                {diagnosticReport.issues.map((iss, idx) => (
                  <div key={idx} className="p-4 flex items-start gap-3">
                    {iss.severity === 'critical' ? (
                      <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    ) : iss.severity === 'warning' ? (
                      <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    ) : (
                      <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{iss.category}</span>
                        <span className={`text-[10px] px-2 py-0.2 rounded uppercase font-semibold ${
                          iss.severity === 'critical'
                            ? 'bg-rose-500/20 text-rose-300'
                            : iss.severity === 'warning'
                            ? 'bg-amber-500/20 text-amber-300'
                            : 'bg-blue-500/20 text-blue-300'
                        }`}>
                          {iss.severity}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">{iss.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
