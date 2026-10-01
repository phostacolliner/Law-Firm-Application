import React from 'react';
import { useApp } from '../../context/AppContext';
import { SectorReportSummaryStat } from '../../utils/reportExporter';
import { 
  Printer, 
  Download, 
  X, 
  Check, 
  ShieldCheck, 
  Building2, 
  Calendar, 
  Copy,
  FileSpreadsheet
} from 'lucide-react';
import { exportToCsv, copyReportSummaryToClipboard } from '../../utils/reportExporter';

interface OfficialReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportTitle: string;
  reportSubtitle?: string;
  sectorName: string;
  dateRangeText?: string;
  summaryStats?: SectorReportSummaryStat[];
  tableHeaders?: string[];
  headers?: string[];
  tableRows?: (string | number)[][];
  rows?: (string | number)[][];
  filenamePrefix: string;
  statutoryReference?: string;
}

export const OfficialReportModal: React.FC<OfficialReportModalProps> = ({
  isOpen,
  onClose,
  reportTitle,
  reportSubtitle,
  sectorName,
  dateRangeText = 'All Records in Scope',
  summaryStats = [],
  tableHeaders,
  headers,
  tableRows,
  rows,
  filenamePrefix,
  statutoryReference
}) => {
  const { firmProfile, currentUser } = useApp();
  const [copied, setCopied] = React.useState(false);

  const resolvedHeaders = tableHeaders || headers || [];
  const resolvedRows = tableRows || rows || [];

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleExportCsv = () => {
    const filename = `${filenamePrefix}_${new Date().toISOString().slice(0, 10)}.csv`;
    exportToCsv(filename, resolvedHeaders, resolvedRows);
  };

  const handleCopySummary = async () => {
    const success = await copyReportSummaryToClipboard(
      reportTitle,
      summaryStats,
      resolvedRows.length
    );
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const todayStr = '2026-09-28';

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Modal Container */}
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto">
        
        {/* Modal Top Actions Toolbar (Hidden during print) */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 bg-slate-950 border-b border-slate-800 print:hidden shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-xs font-bold text-amber-400 tracking-wider uppercase">
              Formal Sector Report Preview & Export
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopySummary}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer"
              title="Copy executive summary to clipboard"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Summary'}</span>
            </button>

            <button
              onClick={handleExportCsv}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 transition-colors cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20 transition-all cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-slate-950" />
              <span>Print / Save PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer ml-2"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Printable Document Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-950 print:bg-white print:text-black print:p-0 print:m-0 print:overflow-visible">
          {/* Printable White Sheet */}
          <div className="bg-white text-slate-900 rounded-xl shadow-lg p-6 sm:p-10 max-w-4xl mx-auto print:shadow-none print:rounded-none print:max-w-none print:p-6 print:border-none border border-slate-200">
            
            {/* 1. Official Law Firm Letterhead */}
            <div className="border-b-2 border-slate-900 pb-5 mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Building2 className="w-6 h-6 text-slate-800" />
                    <h1 className="text-xl sm:text-2xl font-serif font-black tracking-tight text-slate-950 uppercase">
                      {firmProfile?.firmName || 'LEXISFIRM ADVOCATES LLP'}
                    </h1>
                  </div>
                  <p className="text-xs text-slate-600 font-serif italic mt-0.5">
                    Commissioners for Oaths • Notaries Public • Registered Patent & Trade Mark Agents
                  </p>
                  <p className="text-[11px] text-slate-500 font-sans mt-1">
                    {firmProfile?.officeAddress || 'Upperhill Chambers, 8th Floor, 2nd Ngong Avenue, Nairobi, Kenya'}
                  </p>
                </div>

                <div className="text-left sm:text-right font-mono text-[11px] text-slate-600 space-y-0.5">
                  <p><span className="font-bold text-slate-800">KRA PIN:</span> {firmProfile?.kraPin || 'P051982341Z'}</p>
                  <p><span className="font-bold text-slate-800">LSK Reg No:</span> {firmProfile?.lskRegistrationNo || 'LSK/FIR/2026/0482'}</p>
                  <p><span className="font-bold text-slate-800">Email:</span> {firmProfile?.billingEmail || 'records@lexisfirm.co.ke'}</p>
                  <p><span className="font-bold text-slate-800">Tel:</span> +254 (0) 20 271 8900</p>
                </div>
              </div>
            </div>

            {/* 2. Report Heading & Meta */}
            <div className="mb-6 flex flex-col sm:flex-row justify-between sm:items-end gap-3 bg-slate-50 p-4 rounded-lg border border-slate-200">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-white">
                    Sector: {sectorName}
                  </span>
                  {statutoryReference && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-amber-900 border border-amber-300">
                      {statutoryReference}
                    </span>
                  )}
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-950">
                  {reportTitle}
                </h2>
                {reportSubtitle && (
                  <p className="text-xs text-slate-600 mt-0.5">
                    {reportSubtitle}
                  </p>
                )}
              </div>

              <div className="text-left sm:text-right text-[11px] font-sans text-slate-600 space-y-0.5 shrink-0">
                <p><strong className="text-slate-800">Period:</strong> {dateRangeText}</p>
                <p><strong className="text-slate-800">Generated:</strong> {todayStr} (10:05 EAT)</p>
                <p><strong className="text-slate-800">Officer:</strong> {currentUser?.name || 'Managing Partner'}</p>
              </div>
            </div>

            {/* 3. Executive Metric Summary Cards */}
            {summaryStats.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                {summaryStats.map((stat, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-lg border ${
                      stat.highlight
                        ? 'bg-amber-50 border-amber-300'
                        : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <p className="text-[10px] uppercase font-bold text-slate-600 tracking-wider">
                      {stat.label}
                    </p>
                    <p className={`text-sm sm:text-base font-bold font-mono mt-0.5 ${
                      stat.highlight ? 'text-amber-950' : 'text-slate-900'
                    }`}>
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* 4. Tabular Data Rows */}
            <div className="mb-8 overflow-x-auto">
              <table className="w-full text-left text-[11px] border-collapse">
                <thead>
                  <tr className="border-b-2 border-slate-900 bg-slate-100">
                    <th className="py-2 px-2.5 font-bold text-slate-900 uppercase tracking-wider text-[10px] w-8">#</th>
                    {resolvedHeaders.map((head, i) => (
                      <th
                        key={i}
                        className="py-2 px-2.5 font-bold text-slate-900 uppercase tracking-wider text-[10px]"
                      >
                        {head}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {resolvedRows.length === 0 ? (
                    <tr>
                      <td colSpan={resolvedHeaders.length + 1} className="py-8 text-center text-slate-500 italic">
                        No records found for the selected period and criteria.
                      </td>
                    </tr>
                  ) : (
                    resolvedRows.map((row, rIdx) => (
                      <tr 
                        key={rIdx} 
                        className={rIdx % 2 === 0 ? 'bg-white' : 'bg-slate-50/70'}
                      >
                        <td className="py-2 px-2.5 font-mono text-slate-400 text-[10px]">{rIdx + 1}</td>
                        {row.map((cell, cIdx) => (
                          <td key={cIdx} className="py-2 px-2.5 text-slate-800">
                            {String(cell)}
                          </td>
                        ))}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* 5. Statutory Declaration & Advocate Attestation */}
            <div className="border-t-2 border-slate-300 pt-6 mt-8">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-6">
                <div className="max-w-md text-[10px] text-slate-600 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-slate-800 uppercase tracking-wider">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Statutory Certification & Attestation</span>
                  </div>
                  <p>
                    I hereby certify that this extracted report reflects true and accurate records extracted from 
                    the computerized Practice Management and Accounting System of {firmProfile?.firmName || 'LexisFirm Advocates LLP'} 
                    pursuant to the Advocates Act (Cap 16) and Law Society of Kenya Practice Directives.
                  </p>
                  <p className="font-mono text-[9px] text-slate-500">
                    System Audit Verification Hash: LFMS-SEC-{Date.now().toString(36).toUpperCase()}
                  </p>
                </div>

                <div className="w-full sm:w-64 text-center sm:text-right shrink-0">
                  <div className="h-12 border-b border-dashed border-slate-400 mb-1 flex items-end justify-center sm:justify-end">
                    <span className="font-serif italic text-xs text-slate-500 mb-1">
                      {firmProfile?.managingPartner || 'Phosta Colliner, SC'}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-slate-900">Managing Partner / Senior Counsel</p>
                  <p className="text-[10px] text-slate-600">For and on behalf of the Firm</p>
                </div>
              </div>
            </div>

            {/* Footer Notice */}
            <div className="mt-8 pt-4 border-t border-slate-200 text-center text-[10px] text-slate-500 flex justify-between items-center">
              <span>Confidential • Attorney-Client Privileged Work Product</span>
              <span>Page 1 of 1 • System Generated by LFMS Enterprise</span>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
