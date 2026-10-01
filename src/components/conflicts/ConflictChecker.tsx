import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ShieldAlert, 
  Search, 
  CheckCircle2, 
  AlertTriangle, 
  Building, 
  User, 
  Briefcase, 
  Scale,
  FileCheck2,
  Calendar as CalendarIcon,
  Printer,
  FileSpreadsheet,
  Download
} from 'lucide-react';
import { DropdownDatePicker } from '../common/DropdownDatePicker';
import { OfficialReportModal } from '../reports/OfficialReportModal';
import { exportToCsv, exportToJson, SectorReportSummaryStat } from '../../utils/reportExporter';

export const ConflictChecker: React.FC = () => {
  const { runConflictCheck, matters, clients, setSelectedMatterId, setActiveTab, currentUser } = useApp();

  const [query, setQuery] = useState('');
  const [searchDate, setSearchDate] = useState('2026-09-28');
  const [hasSearched, setHasSearched] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [isCertificateModalOpen, setIsCertificateModalOpen] = useState(false);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    const res = runConflictCheck(query);
    setResult(res);
    setHasSearched(true);
  };

  const sampleNames = [
    'XYZ Logistics Limited',
    'Prime Properties Holdings Ltd',
    'St. Jude Hospital',
    'Wilson Gichuru',
    'Apex Milling',
    'Kenya Railways Corporation'
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div>
        <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-amber-400" />
          Conflict of Interest Check Engine
        </h1>
        <p className="text-xs text-slate-400">
          Statutory compliance check under Advocates Act (Cap 16) — scans adverse parties, co-litigants, and existing clients
        </p>
      </div>

      {/* Search Input Box */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm space-y-4 max-w-3xl">
        <form onSubmit={handleSearch} className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Enter individual name, company name, director, or institution to check..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-3 text-sm bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-amber-500"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
            >
              Run Conflict Scan
            </button>
          </div>

          {/* Statutory Verification Date Picker */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/80 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-semibold text-slate-300">Statutory Clearance Date:</span>
              <div className="w-44">
                <DropdownDatePicker
                  value={searchDate}
                  onChange={setSearchDate}
                  placeholder="Verification date"
                  showPresets={true}
                />
              </div>
            </div>
            <span className="text-[11px] text-slate-400">Governing Law: Advocates Act (Cap 16) & LSK Code</span>
          </div>
        </form>

        {/* Quick sample chips */}
        <div className="flex items-center gap-2 flex-wrap text-xs text-slate-400">
          <span>Quick test queries:</span>
          {sampleNames.map(name => (
            <button
              key={name}
              onClick={() => {
                setQuery(name);
                const res = runConflictCheck(name);
                setResult(res);
                setHasSearched(true);
              }}
              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 cursor-pointer"
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      {/* Results Display */}
      {hasSearched && (
        <div className="max-w-3xl space-y-4">
          {result?.hasConflict ? (
            <div className="p-6 rounded-2xl bg-rose-950/30 border-2 border-rose-500/50 shadow-xl space-y-4">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/40 shrink-0">
                    <AlertTriangle className="w-7 h-7 animate-pulse" />
                  </div>
                  <div>
                    <span className="text-xs font-black uppercase tracking-wider px-2 py-0.5 rounded bg-rose-600 text-white font-mono">
                      Potential Conflict of Interest Flagged
                    </span>
                    <h3 className="text-lg font-bold text-white mt-1">
                      "{query}" appears in firm matter records!
                    </h3>
                    <p className="text-xs text-rose-200 mt-0.5 leading-relaxed">
                      Advocate ethical rules prevent acting against existing clients or adverse parties without formal waiver and ethical wall approval.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      exportToCsv(
                        `Conflict_Check_Flagged_${query.replace(/\s+/g, '_')}_${searchDate}.csv`,
                        ['Search Query', 'Verification Date', 'Match Type', 'Conflicting Entity', 'Record Details', 'Associated Matter'],
                        result.matches.map((m: any) => [query, searchDate, m.type, m.name, m.details, m.matterNumber || 'N/A'])
                      );
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 cursor-pointer"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Export CSV</span>
                  </button>
                  <button
                    onClick={() => setIsCertificateModalOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded-lg cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Report</span>
                  </button>
                </div>
              </div>

              {/* Matches List */}
              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-300 block">
                  Identified Conflicting Records ({result.matches.length}):
                </span>
                {result.matches.map((m: any, idx: number) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-900 border border-rose-500/30 flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <span className="font-bold text-white text-sm block">{m.name}</span>
                      <span className="text-slate-300 mt-0.5 block">{m.details}</span>
                    </div>

                    {m.matterNumber && (
                      <button
                        onClick={() => {
                          const matter = matters.find(item => item.matterNumber === m.matterNumber);
                          if (matter) {
                            setSelectedMatterId(matter.id);
                            setActiveTab('matters');
                          }
                        }}
                        className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs transition-colors shrink-0 cursor-pointer"
                      >
                        Inspect Matter Dossier →
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-2xl bg-emerald-950/30 border-2 border-emerald-500/40 shadow-xl space-y-4">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">
                      Clear: No Adverse Conflicts Detected for "{query}"
                    </h3>
                    <p className="text-xs text-emerald-300">
                      The entity does not match any current active clients, opposing parties, or represented co-litigants. Safe to proceed with client intake.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      exportToCsv(
                        `Conflict_Clearance_Certificate_${query.replace(/\s+/g, '_')}_${searchDate}.csv`,
                        ['Search Query', 'Verification Date', 'Status', 'Advocate Signoff', 'Statutory Ref'],
                        [[query, searchDate, 'CLEARED - NO CONFLICT', currentUser.name, 'Advocates Act Cap 16']]
                      );
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 cursor-pointer"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Export CSV</span>
                  </button>
                  <button
                    onClick={() => setIsCertificateModalOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Official Clearance Certificate</span>
                  </button>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 font-mono">
                Verification Date: {searchDate} • Certified by {currentUser.name} ({currentUser.title}) • Logged in firm compliance audit log.
              </div>
            </div>
          )}
        </div>
      )}

      {/* Official Certificate & Report Modal */}
      {isCertificateModalOpen && (
        <OfficialReportModal
          isOpen={isCertificateModalOpen}
          onClose={() => setIsCertificateModalOpen(false)}
          reportTitle="Statutory Conflict of Interest Clearance Certificate"
          reportSubtitle={`Ethical screening under Advocates Act (Cap 16) — Target: "${query}"`}
          sectorName="Conflict of Interest & Ethical Compliance"
          headers={['Parameter / Field', 'Recorded Verification Value']}
          rows={[
            ['Subject Entity Queried', query],
            ['Statutory Clearance Date', searchDate],
            ['Screening Result', result?.hasConflict ? 'ADVERSE CONFLICT DETECTED - ETHICAL BARRIER' : 'CLEARED - NO ADVERSE MATCHES'],
            ['Risk Score', result?.hasConflict ? `${result.score}% (High Alert)` : '0% (Clean Clearance)'],
            ['Active Client Database Matches', result?.matches?.filter((m: any) => m.type === 'Client').length || 0],
            ['Adverse Litigation Matches', result?.matches?.filter((m: any) => m.type === 'Matter Opposing Party').length || 0],
            ['Co-Party Representation Matches', result?.matches?.filter((m: any) => m.type === 'Matter Co-Party').length || 0],
            ['Compliance Reviewing Officer', `${currentUser.name} (${currentUser.title})`],
            ['Statutory Legal Framework', 'Advocates Act (Cap 16 Laws of Kenya), Law Society of Kenya Code of Standards']
          ]}
          summaryStats={[
            { label: 'Screened Entity', value: query },
            { label: 'Clearance Status', value: result?.hasConflict ? 'BLOCKED' : 'CLEARED', highlight: true },
            { label: 'Conflict Matches', value: result?.matches?.length || 0 },
            { label: 'Risk Rating', value: result?.hasConflict ? 'High Risk' : 'Zero Risk' }
          ]}
          filenamePrefix={`Conflict_Certificate_${query.replace(/\s+/g, '_')}`}
          statutoryReference="Advocates Act (Cap 16) & Advocates Practice Rules, Rule 9"
        />
      )}
    </div>
  );
};
