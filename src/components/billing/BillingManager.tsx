import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Invoice } from '../../types';
import { 
  Receipt, 
  Plus, 
  Search, 
  Filter, 
  DollarSign, 
  Printer, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Download, 
  Building2, 
  FileText,
  CreditCard,
  X
} from 'lucide-react';
import { DropdownDatePicker } from '../common/DropdownDatePicker';
import { SectorExportButton } from '../reports/SectorExportButton';

interface BillingManagerProps {
  onOpenNewInvoice: () => void;
  onOpenRecordPayment: (invoiceId: string) => void;
}

export const BillingManager: React.FC<BillingManagerProps> = ({ 
  onOpenNewInvoice, 
  onOpenRecordPayment 
}) => {
  const { invoices, receipts, setSelectedMatterId, setActiveTab, formatKSh } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [filterDate, setFilterDate] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(invoices[0] || null);

  const filteredInvoices = invoices.filter(i => {
    const matchesSearch = 
      i.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.matterTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.matterNumber.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || i.status === statusFilter;
    const matchesDate = !filterDate || i.dateIssued === filterDate || i.dueDate === filterDate;
    return matchesSearch && matchesStatus && matchesDate;
  });

  const totalBilled = invoices.reduce((acc, i) => acc + i.totalAmount, 0);
  const totalPaid = invoices.reduce((acc, i) => acc + i.amountPaid, 0);
  const totalOutstanding = invoices.reduce((acc, i) => acc + i.balanceDue, 0);

  const invoiceReceipts = selectedInvoice 
    ? receipts.filter(r => r.invoiceId === selectedInvoice.id) 
    : [];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Receipt className="w-5 h-5 text-amber-400" />
            Billing, Invoicing & Fee Notes
          </h1>
          <p className="text-xs text-slate-400">
            Professional fees under Advocates Remuneration Order, disbursements, VAT (16%), and receipting
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <SectorExportButton
            sectorKey="billing"
            reportTitle="Fee Notes, Invoices & Collections Aging Report"
            reportSubtitle="Professional legal fees billed, KRA Output VAT (16%), collections, and receivable aging"
            sectorName="Billing & Receivables"
            statutoryReference="Advocates (Remuneration) Order & VAT Act"
            filenamePrefix="LexisFirm_Billing_Report"
            headers={['Invoice No', 'Client Name', 'Matter Title', 'Issue Date', 'Due Date', 'Net Fee (KES)', 'VAT 16% (KES)', 'Total (KES)', 'Paid (KES)', 'Balance Due (KES)', 'Status']}
            rows={filteredInvoices.map(inv => [
              inv.invoiceNumber,
              inv.clientName,
              inv.matterTitle,
              inv.dateIssued || inv.issueDate || '2026-09-01',
              inv.dueDate,
              (inv.subtotal || 0).toLocaleString(),
              (inv.vatAmount ?? inv.taxAmount ?? 0).toLocaleString(),
              (inv.totalAmount || 0).toLocaleString(),
              (inv.paidAmount ?? (inv.totalAmount - inv.balanceDue)).toLocaleString(),
              (inv.balanceDue || 0).toLocaleString(),
              inv.status.toUpperCase()
            ])}
            summaryStats={[
              { label: 'Total Invoiced Gross', value: formatKSh(totalBilled), highlight: true },
              { label: 'Realized Collections', value: formatKSh(totalPaid) },
              { label: 'Outstanding Receivables', value: formatKSh(totalOutstanding), highlight: totalOutstanding > 0 },
              { label: 'Output VAT (16%)', value: formatKSh(filteredInvoices.reduce((acc, i) => acc + (i.vatAmount ?? i.taxAmount ?? 0), 0)) }
            ]}
          />

          <button
            onClick={onOpenNewInvoice}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Generate New Fee Note</span>
          </button>
        </div>
      </div>

      {/* KPI Financial Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Billed Fees</span>
          <p className="text-xl font-bold text-white font-mono mt-2">{formatKSh(totalBilled)}</p>
          <p className="text-[11px] text-slate-400 mt-1">{invoices.length} Fee Notes issued</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Total Realized Collections</span>
          <p className="text-xl font-bold text-emerald-300 font-mono mt-2">{formatKSh(totalPaid)}</p>
          <p className="text-[11px] text-emerald-400/80 mt-1">Realization rate: {((totalPaid / (totalBilled || 1)) * 100).toFixed(1)}%</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-400">Outstanding Receivables</span>
          <p className="text-xl font-bold text-rose-300 font-mono mt-2">{formatKSh(totalOutstanding)}</p>
          <p className="text-[11px] text-rose-400/80 mt-1">Pending client remittance</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row gap-3 items-center justify-between shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search fee notes by invoice #, client, matter title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-amber-500 transition-colors"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-amber-500 cursor-pointer"
        >
          <option value="all">All Payment Statuses</option>
          <option value="Paid">Paid in Full</option>
          <option value="Partially Paid">Partially Paid</option>
          <option value="Sent">Sent / Pending</option>
          <option value="Overdue">Overdue (30+ Days)</option>
        </select>

        {/* Dropdown Calendar Date Picker */}
        <div className="w-44">
          <DropdownDatePicker
            value={filterDate}
            onChange={setFilterDate}
            placeholder="Filter by Date"
            align="right"
          />
        </div>

        {filterDate && (
          <button
            onClick={() => setFilterDate('')}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
            title="Clear date filter"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Two-Column Layout: Invoices List & Printable Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Invoices List (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm flex flex-col max-h-[750px]">
          <div className="p-3 bg-slate-850 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold uppercase tracking-wider text-[11px]">Fee Notes Register</span>
            <span>{filteredInvoices.length} invoices</span>
          </div>

          <div className="overflow-y-auto divide-y divide-slate-800/80 flex-1">
            {filteredInvoices.map(inv => {
              const isSelected = selectedInvoice?.id === inv.id;
              return (
                <div
                  key={inv.id}
                  onClick={() => setSelectedInvoice(inv)}
                  className={`p-3.5 transition-all cursor-pointer flex items-start justify-between gap-3 ${
                    isSelected ? 'bg-amber-500/10 border-l-4 border-amber-400' : 'hover:bg-slate-800/50'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white font-mono">{inv.invoiceNumber}</span>
                      <span className={`text-[9px] font-mono uppercase font-bold px-1.5 py-0.2 rounded ${
                        inv.status === 'Paid' ? 'bg-emerald-500/20 text-emerald-300' :
                        inv.status === 'Overdue' ? 'bg-rose-500/20 text-rose-300' :
                        'bg-amber-500/20 text-amber-300'
                      }`}>
                        {inv.status}
                      </span>
                    </div>

                    <p className="text-xs font-semibold text-slate-200 mt-1">{inv.clientName}</p>
                    <p className="text-[11px] text-slate-400 line-clamp-1">{inv.matterTitle}</p>
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">Due: {inv.dueDate}</p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-bold text-white font-mono block">
                      {formatKSh(inv.totalAmount)}
                    </span>
                    {inv.balanceDue > 0 ? (
                      <span className="text-[10px] font-mono text-rose-400 font-medium block mt-1">
                        Bal: {formatKSh(inv.balanceDue)}
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold text-emerald-400 block mt-1">Paid</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Printable Fee Note View with Advocate Letterhead (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {selectedInvoice ? (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm space-y-6">
              {/* Actions Bar */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Certified Advocate Fee Note Preview
                </span>

                <div className="flex items-center gap-2">
                  {selectedInvoice.balanceDue > 0 && (
                    <button
                      onClick={() => onOpenRecordPayment(selectedInvoice.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer"
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>Record Payment</span>
                    </button>
                  )}
                  <button
                    onClick={() => window.print()}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print / PDF</span>
                  </button>
                </div>
              </div>

              {/* Official Law Firm Letterhead */}
              <div className="p-6 bg-slate-950 border border-slate-800 rounded-xl space-y-6 text-slate-200">
                {/* Chambers Header */}
                <div className="border-b border-slate-800 pb-4 text-center space-y-1">
                  <h2 className="font-serif text-lg font-bold text-white tracking-wide">
                    LEXISFIRM ADVOCATES LLP
                  </h2>
                  <p className="text-[11px] text-amber-400 font-semibold uppercase tracking-wider">
                    Advocates, Commissioners for Oaths & Notaries Public
                  </p>
                  <p className="text-[10px] text-slate-400">
                    Upper Hill Chambers, 4th Floor, Ralph Bunche Road, Nairobi • P.O. Box 45012-00100 Nairobi
                  </p>
                  <p className="text-[10px] text-slate-400 font-mono">
                    Tel: +254 20 2710000 / +254 722 000 111 • KRA PIN: P051982341M • Email: billing@lexisfirm.co.ke
                  </p>
                </div>

                {/* Invoice Particulars Row */}
                <div className="flex justify-between gap-4 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Billed To:</span>
                    <p className="font-bold text-white text-sm">{selectedInvoice.clientName}</p>
                    <p className="text-slate-300">{selectedInvoice.clientAddress}</p>
                    <p className="font-mono text-slate-400 mt-0.5">KRA PIN: {selectedInvoice.clientPin}</p>
                  </div>

                  <div className="text-right space-y-1 font-mono text-[11px]">
                    <div>
                      <span className="text-slate-400">Fee Note #: </span>
                      <strong className="text-white">{selectedInvoice.invoiceNumber}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400">Date Issued: </span>
                      <span className="text-slate-200">{selectedInvoice.dateIssued}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Due Date: </span>
                      <strong className="text-amber-400">{selectedInvoice.dueDate}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400">Matter Ref: </span>
                      <span className="text-slate-200">{selectedInvoice.matterNumber}</span>
                    </div>
                  </div>
                </div>

                {/* Matter Subject Banner */}
                <div className="p-2.5 rounded bg-slate-900 border border-slate-800 text-xs">
                  <span className="text-slate-400 font-bold uppercase text-[10px] block">In the Matter of:</span>
                  <span className="font-semibold text-white">{selectedInvoice.matterTitle}</span>
                </div>

                {/* Items Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 text-[10px] font-mono uppercase">
                        <th className="pb-2">Description of Services & Outlays</th>
                        <th className="pb-2">Category</th>
                        <th className="pb-2 text-right">Amount (KSh)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-mono">
                      {selectedInvoice.items.map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-900/40">
                          <td className="py-2.5 text-slate-200 font-sans">{item.description}</td>
                          <td className="py-2.5 text-slate-400 text-[11px] capitalize">
                            {item.type.replace('_', ' ')}
                          </td>
                          <td className="py-2.5 text-right text-slate-100">{Number(item.amount).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Subtotal, VAT & Total Box */}
                <div className="pt-3 border-t border-slate-800 flex justify-end">
                  <div className="w-64 space-y-1.5 text-xs font-mono">
                    <div className="flex justify-between text-slate-400">
                      <span>Subtotal Fees:</span>
                      <span>KSh {selectedInvoice.subtotal.toLocaleString()}</span>
                    </div>
                    {selectedInvoice.applyVat && (
                      <div className="flex justify-between text-slate-400">
                        <span>VAT (16%):</span>
                        <span>KSh {selectedInvoice.vatAmount.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold text-white text-sm pt-2 border-t border-slate-800">
                      <span>Total Amount:</span>
                      <span className="text-emerald-400">KSh {selectedInvoice.totalAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Amount Paid:</span>
                      <span className="text-slate-200">KSh {selectedInvoice.amountPaid.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between font-bold text-rose-400 pt-1 border-t border-slate-800">
                      <span>Balance Due:</span>
                      <span>KSh {selectedInvoice.balanceDue.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Payment Remittance Particulars */}
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg text-[11px] space-y-1">
                  <p className="font-bold text-slate-300">Bank Remittance Instructions:</p>
                  <p className="text-slate-400">Bank: <strong className="text-slate-200">Stanbic Bank Kenya</strong> • Branch: <strong className="text-slate-200">Upper Hill</strong></p>
                  <p className="text-slate-400">Account Name: <strong className="text-slate-200">LexisFirm Advocates LLP Office Account</strong> • Acc No: <strong className="text-slate-200 font-mono">0100 2894 1200</strong></p>
                  <p className="text-slate-400">M-Pesa Paybill: <strong className="text-slate-200 font-mono">522522</strong> • Account: <strong className="text-amber-400 font-mono">{selectedInvoice.invoiceNumber}</strong></p>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-slate-400 bg-slate-900 border border-slate-800 rounded-xl">
              Select an invoice to review.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
