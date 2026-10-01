import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { OfficialReportModal } from './OfficialReportModal';
import { exportToCsv, SectorReportSummaryStat } from '../../utils/reportExporter';
import { 
  FileSpreadsheet, 
  Printer, 
  Download, 
  ExternalLink, 
  ChevronDown,
  FileText
} from 'lucide-react';

interface SectorExportButtonProps {
  sectorKey: string;
  reportTitle: string;
  reportSubtitle?: string;
  sectorName: string;
  headers: string[];
  rows: (string | number)[][];
  summaryStats?: SectorReportSummaryStat[];
  filenamePrefix: string;
  statutoryReference?: string;
  className?: string;
}

export const SectorExportButton: React.FC<SectorExportButtonProps> = ({
  sectorKey,
  reportTitle,
  reportSubtitle,
  sectorName,
  headers,
  rows,
  summaryStats = [],
  filenamePrefix,
  statutoryReference,
  className = ''
}) => {
  const { setActiveTab } = useApp();
  const [isOpenMenu, setIsOpenMenu] = useState(false);
  const [isOfficialModalOpen, setIsOfficialModalOpen] = useState(false);

  const handleExportCsv = () => {
    const filename = `${filenamePrefix}_${new Date().toISOString().slice(0, 10)}.csv`;
    exportToCsv(filename, headers, rows);
    setIsOpenMenu(false);
  };

  const handleOpenPrint = () => {
    setIsOfficialModalOpen(true);
    setIsOpenMenu(false);
  };

  const handleGoToReportsHub = () => {
    setActiveTab('reports');
    setIsOpenMenu(false);
  };

  return (
    <div className={`relative inline-block ${className}`}>
      {/* Trigger Button Group */}
      <div className="flex items-center rounded-lg bg-slate-800 border border-slate-700 hover:border-slate-600 transition-colors shadow-sm">
        <button
          type="button"
          onClick={handleExportCsv}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:text-white transition-colors cursor-pointer"
          title={`Export ${rows.length} records as CSV`}
        >
          <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
          <span>Export Report</span>
          <span className="text-[10px] text-slate-400 font-mono">({rows.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setIsOpenMenu(!isOpenMenu)}
          className="px-1.5 py-1.5 border-l border-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isOpenMenu ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Dropdown Options */}
      {isOpenMenu && (
        <div className="absolute right-0 mt-1 z-40 w-56 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-1.5 space-y-1">
          <div className="px-2.5 py-1.5 border-b border-slate-800 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            {sectorName} Extraction
          </div>

          <button
            type="button"
            onClick={handleExportCsv}
            className="w-full flex items-center gap-2 px-2.5 py-2 text-xs font-medium text-slate-200 hover:text-white hover:bg-slate-800 rounded-lg transition-colors text-left cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <p className="font-semibold leading-tight">Export CSV Spreadsheet</p>
              <p className="text-[10px] text-slate-400">Excel-compatible ({rows.length} rows)</p>
            </div>
          </button>

          <button
            type="button"
            onClick={handleOpenPrint}
            className="w-full flex items-center gap-2 px-2.5 py-2 text-xs font-medium text-slate-200 hover:text-white hover:bg-slate-800 rounded-lg transition-colors text-left cursor-pointer"
          >
            <Printer className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <p className="font-semibold leading-tight">Official Print / PDF Report</p>
              <p className="text-[10px] text-slate-400">Formal letterhead & sign-off</p>
            </div>
          </button>

          <div className="pt-1 border-t border-slate-800">
            <button
              type="button"
              onClick={handleGoToReportsHub}
              className="w-full flex items-center justify-between px-2.5 py-2 text-xs font-medium text-amber-400 hover:bg-amber-500/10 rounded-lg transition-colors text-left cursor-pointer"
            >
              <span className="flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" />
                <span>Open in Reports Hub</span>
              </span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* Official Printable Report Modal */}
      <OfficialReportModal
        isOpen={isOfficialModalOpen}
        onClose={() => setIsOfficialModalOpen(false)}
        reportTitle={reportTitle}
        reportSubtitle={reportSubtitle}
        sectorName={sectorName}
        dateRangeText={`All Active Filtered (${new Date().toISOString().slice(0, 10)})`}
        summaryStats={summaryStats}
        tableHeaders={headers}
        tableRows={rows}
        filenamePrefix={filenamePrefix}
        statutoryReference={statutoryReference}
      />
    </div>
  );
};
