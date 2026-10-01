import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Building2, 
  Calendar, 
  FolderOpen, 
  Receipt, 
  MessageSquare, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  FileText, 
  Send,
  Download,
  Lock,
  FileSpreadsheet,
  Printer
} from 'lucide-react';
import { DropdownDatePicker } from '../common/DropdownDatePicker';
import { OfficialReportModal } from '../reports/OfficialReportModal';
import { exportToCsv } from '../../utils/reportExporter';

export const ClientPortal: React.FC = () => {
  const { matters, courtEvents, documents, invoices, addCommunication, formatKSh } = useApp();

  const [messageText, setMessageText] = useState('');
  const [messageSent, setMessageSent] = useState(false);
  const [statementStartDate, setStatementStartDate] = useState('2026-01-01');
  const [statementEndDate, setStatementEndDate] = useState('2026-12-31');
  const [isStatementModalOpen, setIsStatementModalOpen] = useState(false);

  // Client context: ABC Limited (clientId: 'c-1')
  const clientMatters = matters.filter(m => m.clientId === 'c-1');
  const clientMatterIds = clientMatters.map(m => m.id);

  const clientEvents = courtEvents.filter(e => clientMatterIds.includes(e.matterId));
  const clientDocs = documents.filter(d => clientMatterIds.includes(d.matterId) && d.isClientVisible);
  const rawClientInvoices = invoices.filter(i => i.clientId === 'c-1');

  // Filtered invoices by date
  const clientInvoices = useMemo(() => {
    return rawClientInvoices.filter(i => {
      if (statementStartDate && i.dateIssued < statementStartDate) return false;
      if (statementEndDate && i.dateIssued > statementEndDate) return false;
      return true;
    });
  }, [rawClientInvoices, statementStartDate, statementEndDate]);

  const totalOutstanding = clientInvoices.reduce((acc, i) => acc + i.balanceDue, 0);
  const totalBilled = clientInvoices.reduce((acc, i) => acc + i.totalAmount, 0);
  const totalPaid = clientInvoices.reduce((acc, i) => acc + (i.totalAmount - i.balanceDue), 0);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || clientMatters.length === 0) return;

    addCommunication({
      matterId: clientMatters[0].id,
      matterNumber: clientMatters[0].matterNumber,
      matterTitle: clientMatters[0].title,
      type: 'Client Meeting',
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sender: 'Peter Munene (Client MD)',
      recipient: clientMatters[0].leadAdvocateName,
      summary: messageText,
      actionRequired: 'Counsel review client portal message'
    });

    setMessageText('');
    setMessageSent(true);
    setTimeout(() => setMessageSent(false), 3000);
  };

  const nextHearing = clientEvents.find(e => e.date === '2026-09-29');

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Client Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/20 border border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-emerald-950/40">
            ABC
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white tracking-tight">ABC Limited</h1>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <Lock className="w-3 h-3" />
                Secure Client Portal
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Client Ref: <strong className="text-slate-200">CL-2024-001</strong> • KRA PIN: <strong className="text-slate-200">P051289341X</strong>
            </p>
          </div>
        </div>

        <div className="text-right self-start md:self-center">
          <span className="text-xs text-slate-400 block">Total Outstanding Balance</span>
          <span className="text-xl font-bold text-rose-400 font-mono block">{formatKSh(totalOutstanding)}</span>
        </div>
      </div>

      {/* Hearing Alert */}
      {nextHearing && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-rose-950/60 via-slate-900 to-slate-900 border-2 border-rose-500/50 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/40 shrink-0">
              <Calendar className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="text-xs font-black uppercase tracking-wider px-2 py-0.5 rounded bg-rose-600 text-white font-mono">
                Court Hearing Scheduled Tomorrow
              </span>
              <h3 className="text-base font-bold text-white mt-1">
                {nextHearing.matterTitle}
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Date: <strong className="text-white">Tuesday, 29 Sept 2026 at 09:00 AM</strong> • Venue: <strong className="text-amber-300">{nextHearing.court} ({nextHearing.courtRoom})</strong>
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                Presiding: <strong className="text-slate-200">{nextHearing.judgeName}</strong> • Lead Counsel: <strong className="text-amber-400">{nextHearing.advocateAssigned}</strong>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Two Column: Active Matters & Approved Documents */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Active Matters */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Building2 className="w-4 h-4 text-amber-400" />
            Your Active Matters ({clientMatters.length})
          </h2>

          <div className="space-y-3">
            {clientMatters.map(m => (
              <div
                key={m.id}
                className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/60 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-amber-300 font-bold border border-slate-700">
                    {m.matterNumber}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                    {m.status}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white">{m.title}</h3>

                <p className="text-slate-400">
                  Court Reference: <strong className="text-slate-200 font-mono">{m.caseNumber}</strong>
                </p>
                <p className="text-slate-400">
                  Lead Advocate: <strong className="text-slate-200">{m.leadAdvocateName}</strong>
                </p>

                <div className="p-2.5 rounded bg-slate-900 border border-slate-800 text-[11px] text-amber-300 mt-2">
                  <strong>Current Procedural Action:</strong> {m.nextAction}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Client-Approved Documents */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <FolderOpen className="w-4 h-4 text-blue-400" />
            Authorized Case Documents ({clientDocs.length})
          </h2>

          <div className="space-y-2.5">
            {clientDocs.map(doc => (
              <div
                key={doc.id}
                className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/60 flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-white truncate">{doc.title}</p>
                    <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                      {doc.fileName} • {doc.fileSize} • {doc.version}
                    </p>
                  </div>
                </div>

                <span className="text-[10px] text-slate-400 font-mono shrink-0">
                  {doc.uploadedAt}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Invoices & Fee Notes Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Receipt className="w-4 h-4 text-emerald-400" />
              Invoices & Statements of Account ({clientInvoices.length})
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Fee notes issued under Advocates Remuneration Order (ARO)
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                exportToCsv(
                  `ABC_Limited_Statement_of_Account_${statementStartDate}_to_${statementEndDate}.csv`,
                  ['Invoice No', 'Matter', 'Date Issued', 'Due Date', 'Total (KES)', 'Balance Due (KES)', 'Status'],
                  clientInvoices.map(i => [i.invoiceNumber, i.matterTitle, i.dateIssued, i.dueDate, i.totalAmount, i.balanceDue, i.status])
                );
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={() => setIsStatementModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Official Statement (PDF)</span>
            </button>
          </div>
        </div>

        {/* Date Filter Bar */}
        <div className="flex flex-wrap items-center gap-3 bg-slate-950/60 p-3 rounded-lg border border-slate-800 text-xs text-slate-400">
          <span className="font-semibold text-slate-300">Filter By Billing Date:</span>
          <div className="w-40">
            <DropdownDatePicker
              value={statementStartDate}
              onChange={setStatementStartDate}
              placeholder="From date"
              showPresets={true}
            />
          </div>
          <span className="text-slate-500 font-bold">to</span>
          <div className="w-40">
            <DropdownDatePicker
              value={statementEndDate}
              onChange={setStatementEndDate}
              placeholder="To date"
              showPresets={true}
            />
          </div>
          <button
            onClick={() => {
              setStatementStartDate('2026-01-01');
              setStatementEndDate('2026-12-31');
            }}
            className="text-[11px] text-amber-400 hover:underline ml-auto"
          >
            Reset Dates
          </button>
        </div>

        <div className="space-y-3">
          {clientInvoices.map(inv => (
            <div
              key={inv.id}
              className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white font-mono text-sm">{inv.invoiceNumber}</span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                    inv.status === 'Paid' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                  }`}>
                    {inv.status}
                  </span>
                </div>
                <p className="text-slate-400 mt-1">Matter: {inv.matterTitle}</p>
                <p className="text-[11px] text-slate-400 font-mono mt-0.5">Date Issued: {inv.dateIssued} • Due: {inv.dueDate}</p>
              </div>

              <div className="text-right">
                <span className="text-sm font-bold text-white font-mono block">{formatKSh(inv.totalAmount)}</span>
                {inv.balanceDue > 0 ? (
                  <span className="text-xs text-rose-400 font-mono font-bold block mt-0.5">
                    Outstanding: {formatKSh(inv.balanceDue)}
                  </span>
                ) : (
                  <span className="text-xs text-emerald-400 font-semibold block mt-0.5">Paid in Full</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Direct Secure Message to Lead Advocate */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-3">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-amber-400" />
          Direct Secure Message to Lead Advocate (Phosta Colliner, SC)
        </h2>
        <p className="text-xs text-slate-400">
          Privileged client communication channel. Your inquiry will be logged directly to the case file.
        </p>

        <form onSubmit={handleSendMessage} className="space-y-3">
          <textarea
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            rows={3}
            required
            placeholder="Type your message, document delivery update, or witness question..."
            className="w-full p-3.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-500 resize-none"
          />

          <div className="flex items-center justify-between">
            {messageSent ? (
              <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                Message logged to matter file successfully!
              </span>
            ) : <div />}

            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Message</span>
            </button>
          </div>
        </form>
      </div>

      {/* Official Client Statement Modal */}
      {isStatementModalOpen && (
        <OfficialReportModal
          isOpen={isStatementModalOpen}
          onClose={() => setIsStatementModalOpen(false)}
          reportTitle="Client Statement of Account & Fee Notes Ledger"
          reportSubtitle={`Client: ABC Limited (Ref: CL-2024-001) • Period: ${statementStartDate} to ${statementEndDate}`}
          sectorName="Client Billing & Statement of Account"
          headers={['Invoice No', 'Matter Reference', 'Date Issued', 'Due Date', 'Total (KES)', 'Balance Due (KES)', 'Status']}
          rows={clientInvoices.map(i => [
            i.invoiceNumber,
            i.matterTitle,
            i.dateIssued,
            i.dueDate,
            formatKSh(i.totalAmount),
            formatKSh(i.balanceDue),
            i.status
          ])}
          summaryStats={[
            { label: 'Total Invoiced Value', value: formatKSh(totalBilled) },
            { label: 'Total Paid / Settled', value: formatKSh(totalPaid), highlight: true },
            { label: 'Current Outstanding', value: formatKSh(totalOutstanding), highlight: totalOutstanding > 0 },
            { label: 'Fee Notes Count', value: clientInvoices.length }
          ]}
          filenamePrefix="ABC_Limited_Statement_of_Account"
          statutoryReference="Advocates Remuneration Order (ARO) & Advocates Accounts Rules Cap 16"
        />
      )}
    </div>
  );
};
