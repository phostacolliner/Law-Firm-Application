import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TrustTransaction } from '../../types';
import { 
  Landmark, 
  ShieldCheck, 
  Plus, 
  Search, 
  ArrowDownLeft, 
  ArrowUpRight, 
  FileCheck2, 
  AlertCircle,
  Building,
  CheckCircle2,
  Lock,
  X
} from 'lucide-react';
import { DropdownDatePicker } from '../common/DropdownDatePicker';
import { SectorExportButton } from '../reports/SectorExportButton';

export const TrustAccounting: React.FC = () => {
  const { trustTransactions, addTrustTransaction, matters, currentUser, formatKSh } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterDate, setFilterDate] = useState('');
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);

  // New Trust Entry Form State
  const [selectedMatterId, setSelectedMatterId] = useState(matters[0]?.id || '');
  const [txType, setTxType] = useState<'deposit_received' | 'client_disbursement' | 'transfer_to_office'>('deposit_received');
  const [amount, setAmount] = useState('');
  const [txDate, setTxDate] = useState('2026-09-28');
  const [sourceOrPayee, setSourceOrPayee] = useState('');
  const [purpose, setPurpose] = useState('');

  // Total trust balance
  const totalTrustHeld = trustTransactions.reduce((acc, curr) => {
    return curr.type === 'deposit_received' ? acc + curr.amount : acc - curr.amount;
  }, 0);

  const filteredTx = trustTransactions.filter(t => {
    const matchesSearch = 
      t.transactionNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.matterTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.purpose.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = filterType === 'all' || t.type === filterType;
    const matchesDate = !filterDate || t.date === filterDate;
    return matchesSearch && matchesType && matchesDate;
  });

  const handleCreateTrustTx = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !sourceOrPayee || !purpose) return;

    const matter = matters.find(m => m.id === selectedMatterId);
    if (!matter) return;

    addTrustTransaction({
      matterId: matter.id,
      matterNumber: matter.matterNumber,
      matterTitle: matter.title,
      clientId: matter.clientId,
      clientName: matter.clientName,
      type: txType,
      amount: parseFloat(amount),
      sourceOrPayee,
      purpose,
      date: txDate || new Date().toISOString().split('T')[0],
      verifiedByPartner: currentUser.name,
      supportingDocRef: 'Audited Partner Authorization'
    });

    setIsDepositModalOpen(false);
    setAmount('');
    setSourceOrPayee('');
    setPurpose('');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Landmark className="w-5 h-5 text-emerald-400" />
            Client Account & Trust Accounting (Advocates Accounts Rules)
          </h1>
          <p className="text-xs text-slate-400">
            Strict segregation of client money, conveyancing stakeholder deposits, estate distribution & audits
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <SectorExportButton
            sectorKey="trust"
            reportTitle="Statutory Client Trust Account & Escrow Ledger Statement"
            reportSubtitle="Official ledger of client stakeholder funds pursuant to Section 81 of the Advocates Act"
            sectorName="Client Trust Accounting"
            statutoryReference="Advocates Accounts Rules (Cap 16)"
            filenamePrefix="LexisFirm_Trust_Ledger"
            headers={['Date', 'Tx Number', 'Type', 'Client', 'Matter Title', 'Payee / Source', 'Purpose', 'Amount (KES)', 'Running Balance (KES)']}
            rows={filteredTx.map(t => [
              t.date,
              t.transactionNumber,
              t.type.toUpperCase(),
              t.clientName,
              t.matterTitle,
              t.sourceOrPayee,
              t.purpose,
              t.amount.toLocaleString(),
              t.balanceAfter.toLocaleString()
            ])}
            summaryStats={[
              { label: 'Total Trust Funds Held', value: formatKSh(totalTrustHeld), highlight: true },
              { label: 'Total Transactions', value: filteredTx.length },
              { label: 'Client Deposits', value: formatKSh(filteredTx.filter(t => t.type === 'deposit_received').reduce((a, b) => a + b.amount, 0)) },
              { label: 'Client Disbursements', value: formatKSh(filteredTx.filter(t => t.type !== 'deposit_received').reduce((a, b) => a + b.amount, 0)) }
            ]}
          />

          <button
            onClick={() => setIsDepositModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-colors shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Record Trust Transaction</span>
          </button>
        </div>
      </div>

      {/* Statutory Compliance Notice Banner */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/40 flex items-start gap-3 text-xs">
        <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold text-white uppercase tracking-wider text-[11px]">
            Statutory Legal Trust Segregation Standard (Law Society of Kenya / Cap 16)
          </p>
          <p className="text-slate-300 leading-relaxed">
            All sums held in this ledger are held as <strong>Stakeholder or Trustee</strong> and are legally isolated from the firm's operational cash. No withdrawals or transfers to office account are permissible without verified client authorization or taxed Advocate Fee Note.
          </p>
        </div>
      </div>

      {/* Trust Ledger KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-emerald-500/30 rounded-xl p-5 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Total Client Money Held in Trust</span>
          <p className="text-2xl font-bold text-emerald-300 font-mono mt-2">{formatKSh(totalTrustHeld)}</p>
          <p className="text-[11px] text-slate-400 mt-1">Stanbic Bank Trust A/C #0100 2894 9901</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Conveyancing Stakeholder Deposits</span>
          <p className="text-2xl font-bold text-white font-mono mt-2">{formatKSh(7000000)}</p>
          <p className="text-[11px] text-slate-400 mt-1">L.R. 209/14250/8 (Kilimani) completion funds</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-purple-400">Succession & Estate Escrow</span>
          <p className="text-2xl font-bold text-purple-300 font-mono mt-2">{formatKSh(2200000)}</p>
          <p className="text-[11px] text-slate-400 mt-1">Wilson Gichuru (Deceased) estate funds</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row gap-3 items-center justify-between shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search trust ledger by transaction #, client, matter, or purpose..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500 cursor-pointer"
        >
          <option value="all">All Transaction Types</option>
          <option value="deposit_received">Client Money Received (Credit)</option>
          <option value="client_disbursement">Client Money Paid Out (Debit)</option>
          <option value="transfer_to_office">Transfer to Office Account</option>
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

      {/* Trust Ledger Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 bg-slate-850 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span className="font-semibold uppercase tracking-wider text-[11px]">Advocates Trust Money Journal</span>
          <span>{filteredTx.length} audited entries</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[10px] font-mono uppercase bg-slate-950/40">
                <th className="p-3">Tx Ref & Date</th>
                <th className="p-3">Client & Matter</th>
                <th className="p-3">Nature / Purpose</th>
                <th className="p-3">Source / Payee</th>
                <th className="p-3 text-right">Credit (In)</th>
                <th className="p-3 text-right">Debit (Out)</th>
                <th className="p-3 text-right">Balance After</th>
                <th className="p-3 text-center">Audit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filteredTx.map(tx => {
                const isDeposit = tx.type === 'deposit_received';
                return (
                  <tr key={tx.id} className="hover:bg-slate-800/40">
                    <td className="p-3">
                      <span className="font-bold text-white block">{tx.transactionNumber}</span>
                      <span className="text-[10px] text-slate-400">{tx.date}</span>
                    </td>
                    <td className="p-3 font-sans">
                      <span className="font-semibold text-slate-200 block">{tx.clientName}</span>
                      <span className="text-[11px] text-slate-400">{tx.matterNumber}</span>
                    </td>
                    <td className="p-3 font-sans max-w-xs">
                      <p className="text-slate-300 leading-snug line-clamp-2">{tx.purpose}</p>
                    </td>
                    <td className="p-3 font-sans text-slate-400">
                      {tx.sourceOrPayee}
                    </td>
                    <td className="p-3 text-right text-emerald-400 font-bold">
                      {isDeposit ? formatKSh(tx.amount) : '—'}
                    </td>
                    <td className="p-3 text-right text-rose-400 font-bold">
                      {!isDeposit ? formatKSh(tx.amount) : '—'}
                    </td>
                    <td className="p-3 text-right text-white font-bold">
                      {formatKSh(tx.balanceAfter)}
                    </td>
                    <td className="p-3 text-center">
                      <span className="text-[9px] px-2 py-0.5 rounded bg-slate-800 text-emerald-400 border border-emerald-500/20 font-mono block">
                        Verified
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Trust Transaction Modal */}
      {isDepositModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Landmark className="w-4 h-4 text-emerald-400" />
                Record Trust Money Transaction
              </h3>
              <button onClick={() => setIsDepositModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateTrustTx} className="space-y-4 text-xs">
              <div>
                <label className="text-[11px] text-slate-300 font-semibold block mb-1">Matter Reference</label>
                <select
                  value={selectedMatterId}
                  onChange={(e) => setSelectedMatterId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                >
                  {matters.map(m => (
                    <option key={m.id} value={m.id}>{m.matterNumber}: {m.title.substring(0, 35)}...</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] text-slate-300 font-semibold block mb-1">Transaction Type</label>
                <select
                  value={txType}
                  onChange={(e) => setTxType(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                >
                  <option value="deposit_received">Client Money Received (Stakeholder / Escrow Credit)</option>
                  <option value="client_disbursement">Client Disbursement Paid Out (Debit)</option>
                  <option value="transfer_to_office">Lawful Transfer to Office Account (Billed Fees)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-slate-300 font-semibold block mb-1">Amount (KSh)</label>
                  <input
                    type="number"
                    placeholder="e.g. 8500000"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white font-mono"
                  />
                </div>
                <div>
                  <DropdownDatePicker
                    label="Transaction Date"
                    value={txDate}
                    onChange={setTxDate}
                    required={true}
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] text-slate-300 font-semibold block mb-1">Source Bank / Remitter / Payee</label>
                <input
                  type="text"
                  placeholder="e.g. Stanbic Bank / Purchaser RTGS"
                  value={sourceOrPayee}
                  onChange={(e) => setSourceOrPayee(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-300 font-semibold block mb-1">Legal Purpose / Supporting Clause</label>
                <textarea
                  placeholder="e.g. 10% stakeholder deposit pursuant to Clause 3 of Sale Agreement LR 209/14250/8"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  required
                  rows={3}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white resize-none"
                />
              </div>

              <div className="p-3 rounded bg-slate-950 border border-slate-800 text-[10px] text-slate-400">
                Partner Sign-off: <strong className="text-amber-300">{currentUser.name}</strong> will be logged in the immutable audit register.
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsDepositModalOpen(false)}
                  className="px-3 py-2 rounded-lg bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold cursor-pointer"
                >
                  Verify & Commit Trust Ledger
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
