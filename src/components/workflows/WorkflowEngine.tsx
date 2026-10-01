import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  GitBranch, 
  CheckCircle2, 
  Clock, 
  FileText, 
  ArrowRight, 
  User, 
  ShieldCheck, 
  Landmark, 
  Building2,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { SectorExportButton } from '../reports/SectorExportButton';

export const WorkflowEngine: React.FC = () => {
  const { conveyancingWorkflow, advanceWorkflowStage, setSelectedMatterId, setActiveTab } = useApp();
  const [selectedWorkflow, setSelectedWorkflow] = useState<'conveyancing' | 'litigation'>('conveyancing');

  const currentStage = conveyancingWorkflow.find(s => s.status === 'current') || conveyancingWorkflow[0];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <GitBranch className="w-5 h-5 text-amber-400" />
            Workflow Engine & Matter Pipelines
          </h1>
          <p className="text-xs text-slate-400">
            Automated procedural pipelines: Kenyan Land Conveyancing (ArdhiSasisha) & Civil Litigation stages
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <SectorExportButton
            sectorKey="conveyancing"
            reportTitle="Ardhisasa Land Conveyancing & Registry Pipeline Report"
            reportSubtitle="Official statutory checklist for title searches, stamp duty clearance, and registration"
            sectorName="Conveyancing Practice"
            statutoryReference="Land Registration Act & Ardhisasa Regulations"
            filenamePrefix="LexisFirm_Conveyancing_Pipeline"
            headers={['Stage No', 'Stage Name', 'Assigned Role', 'Required Documents', 'Status', 'Completed Date']}
            rows={conveyancingWorkflow.map(w => [
              w.order,
              w.name,
              w.responsibleRole,
              w.requiredDocuments.join('; '),
              w.status.toUpperCase(),
              w.completedDate || 'Pending'
            ])}
            summaryStats={[
              { label: 'Pipeline Stages', value: conveyancingWorkflow.length },
              { label: 'Completed Stages', value: conveyancingWorkflow.filter(w => w.status === 'completed').length, highlight: true },
              { label: 'Active Stage', value: conveyancingWorkflow.find(w => w.status === 'current')?.name || 'N/A' }
            ]}
          />

          <div className="flex rounded-lg bg-slate-800 p-0.5 border border-slate-700 text-xs">
            <button
              onClick={() => setSelectedWorkflow('conveyancing')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                selectedWorkflow === 'conveyancing' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              10-Stage Conveyancing Pipeline
            </button>
            <button
              onClick={() => setSelectedWorkflow('litigation')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                selectedWorkflow === 'litigation' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Civil Litigation Lifecycle
            </button>
          </div>
        </div>
      </div>

      {selectedWorkflow === 'conveyancing' ? (
        <div className="space-y-6">
          {/* Active Matter Conveyancing Status Header */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/20 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    LF/2026/022
                  </span>
                  <span className="text-xs font-bold text-emerald-400 font-mono">
                    L.R. No. 209/14250/8 (Kilimani Parcel)
                  </span>
                </div>
                <h2 className="text-base font-bold text-white mt-1">
                  Nairobi Heights Developers Ltd — Purchase & Registration Pipeline
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Lead Counsel: <strong className="text-slate-200">Jane Wanjiku Kamau</strong> • Clerk: <strong className="text-slate-200">Brian Mutua</strong> • Value: <strong className="text-emerald-400 font-mono">KSh 85,000,000</strong>
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => advanceWorkflowStage(currentStage.id)}
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-colors flex items-center gap-1.5 shadow-md cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Approve & Advance Next Stage</span>
                </button>
                <button
                  onClick={() => {
                    setSelectedMatterId('m-2');
                    setActiveTab('matters');
                  }}
                  className="px-3.5 py-2 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
                >
                  View Case File
                </button>
              </div>
            </div>

            {/* Current Stage Indicator Banner */}
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-500 text-slate-950 font-bold shrink-0">
                  #{currentStage.order}
                </div>
                <div>
                  <p className="font-bold text-amber-300 uppercase tracking-wider text-[11px]">
                    Current Active Stage: {currentStage.name}
                  </p>
                  <p className="text-slate-200 mt-0.5">{currentStage.description}</p>
                </div>
              </div>

              <div className="text-right hidden sm:block">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Assigned Role</span>
                <span className="text-amber-400 font-semibold">{currentStage.responsibleRole}</span>
              </div>
            </div>
          </div>

          {/* 10-Step Interactive Pipeline Flow */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Ardhi House / Lands Registry 10-Stage Conveyancing Blueprint
            </h3>

            <div className="relative pl-6 space-y-6 before:absolute before:left-3 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-800">
              {conveyancingWorkflow.map((stage) => {
                const isCompleted = stage.status === 'completed';
                const isCurrent = stage.status === 'current';
                return (
                  <div key={stage.id} className="relative group">
                    {/* Circle Icon */}
                    <div
                      className={`absolute -left-6 top-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        isCompleted
                          ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-950/50'
                          : isCurrent
                          ? 'bg-amber-500 text-slate-950 ring-4 ring-amber-500/20 animate-pulse'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}
                    >
                      {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : stage.order}
                    </div>

                    {/* Stage Card */}
                    <div
                      className={`ml-4 p-4 rounded-xl border transition-all ${
                        isCurrent
                          ? 'bg-slate-850 border-amber-500/50 shadow-md'
                          : isCompleted
                          ? 'bg-slate-900/60 border-slate-800/80 text-slate-300'
                          : 'bg-slate-900/30 border-slate-800/40 text-slate-400'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <h4 className={`text-sm font-bold ${isCurrent ? 'text-amber-300' : isCompleted ? 'text-white' : 'text-slate-300'}`}>
                            Stage {stage.order}: {stage.name}
                          </h4>
                          {isCompleted && stage.completedDate && (
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20">
                              Completed: {stage.completedDate}
                            </span>
                          )}
                          {isCurrent && (
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30 animate-pulse">
                              Action Required Now
                            </span>
                          )}
                        </div>

                        <span className="text-[11px] text-slate-400 font-medium">
                          Role: <strong className="text-slate-300">{stage.responsibleRole}</strong>
                        </span>
                      </div>

                      <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                        {stage.description}
                      </p>

                      {/* Required Documents Pill List */}
                      <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex items-center gap-2 flex-wrap text-xs">
                        <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                          <FileText className="w-3 h-3 text-slate-400" />
                          Required Instruments:
                        </span>
                        {stage.requiredDocuments.map(doc => (
                          <span
                            key={doc}
                            className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                              isCompleted
                                ? 'bg-slate-800 text-emerald-300 border border-emerald-500/20'
                                : isCurrent
                                ? 'bg-amber-500/10 text-amber-200 border border-amber-500/20'
                                : 'bg-slate-800/50 text-slate-400'
                            }`}
                          >
                            {doc}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* Civil Litigation Lifecycle Overview */
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            High Court Civil Procedure Litigation Lifecycle
          </h3>
          <p className="text-xs text-slate-400">
            Standard 8-phase litigation pipeline governed by the Civil Procedure Act (Cap 21) & Civil Procedure Rules 2010.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            {[
              { step: 1, name: 'Demand & Notice of Intention to Sue', timeline: '7-14 Days', desc: 'Statutory demand dispatched pursuant to Advocates Remuneration Order.' },
              { step: 2, name: 'Originating Process & Plaint', timeline: 'Filing within limitation', desc: 'Plaint, verifying affidavit, list of witnesses and documents.' },
              { step: 3, name: 'Summons & Service', timeline: 'Service within 30 days', desc: 'Process server executes summons upon Defendant with affidavit of service.' },
              { step: 4, name: 'Statement of Defence & Reply', timeline: '14 Days from service', desc: 'Defendant enters appearance and files defence/counterclaim.' },
              { step: 5, name: 'Pre-Trial Conference (Order 11)', timeline: 'Directions before Registrar', desc: 'Case management, discovery of documents, agreed issues framed.' },
              { step: 6, name: 'Evidentiary Trial & Hearing', timeline: 'Inter-partes hearing', desc: 'Examination-in-chief, cross-examination, and tendering of exhibits.' },
              { step: 7, name: 'Final Written Submissions', timeline: '21 Days post-hearing', desc: 'Legal authorities, precedents and statutory citations filed.' },
              { step: 8, name: 'Judgement & Execution', timeline: 'Within 60 days', desc: 'Court decree issued, taxation of party-and-party costs, execution.' }
            ].map(stage => (
              <div key={stage.step} className="p-4 rounded-xl bg-slate-800/50 border border-slate-800 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 font-bold flex items-center justify-center text-[10px]">
                    {stage.step}
                  </span>
                  <span className="font-mono text-[10px] text-amber-300">{stage.timeline}</span>
                </div>
                <h4 className="font-bold text-white">{stage.name}</h4>
                <p className="text-slate-400 leading-relaxed text-[11px]">{stage.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
