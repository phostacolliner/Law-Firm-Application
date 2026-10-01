import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { OfficeExpense } from '../../types';
import { 
  BarChart3, 
  DollarSign, 
  TrendingUp, 
  Plus, 
  Building, 
  FileSpreadsheet, 
  ArrowDownRight, 
  ArrowUpRight,
  Receipt,
  X
} from 'lucide-react';
import { DropdownDatePicker } from '../common/DropdownDatePicker';
import { SectorExportButton } from '../reports/SectorExportButton';

export const FirmAccounting: React.FC = () => {
  const { officeExpenses, addOfficeExpense, invoices, currentUser, formatKSh } = useApp();

  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<OfficeExpense['category']>('Office Administration');
  const [paidTo, setPaidTo] = useState('');
  const [expenseDate, setExpenseDate] = useState('2026-09-28');
  const [filterDate, setFilterDate] = useState('');

  // Calculations
  const totalOperatingRevenue = invoices.reduce((acc, i) => acc + i.amountPaid, 0);
  const totalOperatingExpenses = officeExpenses.reduce((acc, e) => acc + e.amount, 0);
  const netFirmProfit = totalOperatingRevenue - totalOperatingExpenses;
  const profitMargin = ((netFirmProfit / (totalOperatingRevenue || 1)) * 100).toFixed(1);

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount || !paidTo) return;

    addOfficeExpense({
      category,
      description,
      amount: parseFloat(amount),
      date: expenseDate || new Date().toISOString().split('T')[0],
      paidTo,
      paymentMethod: 'Bank Wire / M-Pesa',
      approvedBy: currentUser.name
    });

    setIsExpenseModalOpen(false);
    setDescription('');
    setAmount('');
    setPaidTo('');
    setExpenseDate('2026-09-28');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-amber-400" />
            Firm Operating Accounting & Profit & Loss
          </h1>
          <p className="text-xs text-slate-400">
            Chambers operational cash flow, monthly overheads, library subscriptions, and partner distributions
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <SectorExportButton
            sectorKey="accounting"
            reportTitle="Firm Operating Accounting & Profit & Loss Statement"
            reportSubtitle="Chambers operational expenditures, disbursements, overheads, and net partner margin"
            sectorName="Practice Accounting"
            statutoryReference="KRA Statutory Filing & P&L"
            filenamePrefix="LexisFirm_Operating_Expenses"
            headers={['Expense No', 'Category', 'Description', 'Vendor / Payee', 'Date', 'Amount (KES)', 'Approved By']}
            rows={officeExpenses.map(e => [
              e.referenceNumber || e.expenseNumber || e.id,
              e.category,
              e.description,
              e.paidTo || e.vendor || 'Vendor',
              e.date,
              e.amount.toLocaleString(),
              e.approvedBy
            ])}
            summaryStats={[
              { label: 'Realized Revenue', value: formatKSh(totalOperatingRevenue), highlight: true },
              { label: 'Operating Expenses', value: formatKSh(totalOperatingExpenses) },
              { label: 'Net Operating Profit', value: formatKSh(netFirmProfit), highlight: true },
              { label: 'Profit Margin', value: `${profitMargin}%` }
            ]}
          />

          <button
            onClick={() => setIsExpenseModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Record Chambers Expense</span>
          </button>
        </div>
      </div>

      {/* Financial KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Realized Fee Revenue</span>
          <p className="text-xl font-bold text-emerald-400 font-mono mt-2">{formatKSh(totalOperatingRevenue)}</p>
          <p className="text-[11px] text-slate-400 mt-1">Operational bank cash</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Operating Expenses</span>
          <p className="text-xl font-bold text-rose-400 font-mono mt-2">{formatKSh(totalOperatingExpenses)}</p>
          <p className="text-[11px] text-slate-400 mt-1">Chambers rent, IT & filing</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Net Operating Profit</span>
          <p className="text-xl font-bold text-amber-300 font-mono mt-2">{formatKSh(netFirmProfit)}</p>
          <p className="text-[11px] text-emerald-400 font-semibold mt-1">Profit Margin: {profitMargin}%</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Partner Profit Allocation</span>
          <p className="text-xl font-bold text-white font-mono mt-2">{formatKSh(netFirmProfit * 0.7)}</p>
          <p className="text-[11px] text-slate-400 mt-1">30% retained for capital reserve</p>
        </div>
      </div>

      {/* Expenses Ledger */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 bg-slate-850 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-400">
          <div>
            <span className="font-semibold uppercase tracking-wider text-[11px] text-white">Chambers Operational Disbursements</span>
            <span className="ml-2 text-slate-400">
              ({officeExpenses.filter(e => !filterDate || e.date === filterDate).length} entries)
            </span>
          </div>

          <div className="flex items-center gap-2">
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
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[10px] font-mono uppercase bg-slate-950/40">
                <th className="p-3">Expense #</th>
                <th className="p-3">Category</th>
                <th className="p-3">Description</th>
                <th className="p-3">Paid To / Vendor</th>
                <th className="p-3">Date</th>
                <th className="p-3 text-right">Amount (KSh)</th>
                <th className="p-3 text-center">Approved By</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {officeExpenses
                .filter(exp => !filterDate || exp.date === filterDate)
                .map(exp => (
                <tr key={exp.id} className="hover:bg-slate-800/40">
                  <td className="p-3 font-bold text-white">{exp.expenseNumber}</td>
                  <td className="p-3 font-sans">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-amber-300 border border-slate-700">
                      {exp.category}
                    </span>
                  </td>
                  <td className="p-3 font-sans text-slate-200">{exp.description}</td>
                  <td className="p-3 font-sans text-slate-300">{exp.paidTo}</td>
                  <td className="p-3 text-slate-400">{exp.date}</td>
                  <td className="p-3 text-right text-rose-400 font-bold">{formatKSh(exp.amount)}</td>
                  <td className="p-3 text-center font-sans text-slate-400">{exp.approvedBy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Expense Modal */}
      {isExpenseModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Record Chambers Operating Expense
              </h3>
              <button onClick={() => setIsExpenseModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleAddExpense} className="space-y-4 text-xs">
              <div>
                <label className="text-[11px] text-slate-300 font-semibold block mb-1">Expense Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                >
                  <option value="Rent & Utilities">Rent & Utilities (Upper Hill Chambers)</option>
                  <option value="Salaries">Staff Salaries & Advocate Retainers</option>
                  <option value="Court Filing Fees">Court E-filing Float & Registrars</option>
                  <option value="Library & Subscriptions">Library & LawAfrica Subscriptions</option>
                  <option value="IT & Software">IT Infrastructure & Software</option>
                  <option value="Office Administration">Stationery & Administration</option>
                  <option value="Marketing">Business Development</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] text-slate-300 font-semibold block mb-1">Description</label>
                <input
                  type="text"
                  placeholder="e.g. October Chambers Rent"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-slate-300 font-semibold block mb-1">Amount (KSh)</label>
                  <input
                    type="number"
                    placeholder="e.g. 320000"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white font-mono"
                  />
                </div>
                <div>
                  <DropdownDatePicker
                    label="Expense Date"
                    value={expenseDate}
                    onChange={setExpenseDate}
                    required={true}
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] text-slate-300 font-semibold block mb-1">Paid To (Vendor / Landlord)</label>
                <input
                  type="text"
                  placeholder="e.g. Upper Hill Chambers Management Ltd"
                  value={paidTo}
                  onChange={(e) => setPaidTo(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsExpenseModalOpen(false)}
                  className="px-3 py-2 rounded-lg bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold cursor-pointer"
                >
                  Commit Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
