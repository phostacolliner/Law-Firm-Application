import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PaymentReceipt } from '../../types';
import { CreditCard, X } from 'lucide-react';
import { DropdownDatePicker } from '../common/DropdownDatePicker';

interface RecordPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoiceId: string;
}

export const RecordPaymentModal: React.FC<RecordPaymentModalProps> = ({ 
  isOpen, 
  onClose, 
  invoiceId 
}) => {
  const { invoices, recordPayment, formatKSh } = useApp();

  const invoice = invoices.find(i => i.id === invoiceId) || invoices[0];
  const [amount, setAmount] = useState(invoice ? String(invoice.balanceDue) : '50000');
  const [paymentMethod, setPaymentMethod] = useState<PaymentReceipt['paymentMethod']>('RTGS / Bank Wire');
  const [paymentDate, setPaymentDate] = useState('2026-09-28');
  const [referenceNumber, setReferenceNumber] = useState('STANBIC-RTGS-' + Math.floor(Math.random() * 90000 + 10000));
  const [accountType, setAccountType] = useState<'office' | 'trust'>('office');

  if (!isOpen || !invoice) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !referenceNumber) return;

    recordPayment({
      invoiceId: invoice.id,
      amount: parseFloat(amount),
      paymentMethod,
      referenceNumber,
      accountType
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-emerald-400" />
            Record Fee Remittance & Issue Receipt
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-400">Invoice Reference:</span>
              <strong className="text-white font-mono">{invoice.invoiceNumber}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Client:</span>
              <strong className="text-slate-200">{invoice.clientName}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Balance Outstanding:</span>
              <strong className="text-rose-400 font-mono">{formatKSh(invoice.balanceDue)}</strong>
            </div>
          </div>

          <div>
            <label className="text-[11px] text-slate-300 font-semibold block mb-1">Amount Paid (KSh)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white font-mono font-bold"
            />
          </div>

          <div>
            <DropdownDatePicker
              label="Remittance / Transaction Date"
              value={paymentDate}
              onChange={setPaymentDate}
              required={true}
            />
          </div>

          <div>
            <label className="text-[11px] text-slate-300 font-semibold block mb-1">Payment Method</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value as any)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
            >
              <option value="RTGS / Bank Wire">RTGS / Bank Wire Transfer</option>
              <option value="M-Pesa Paybill">M-Pesa Paybill (Business Till)</option>
              <option value="Cheque">Banker's Cheque</option>
              <option value="Direct Deposit">Direct Branch Cash Deposit</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] text-slate-300 font-semibold block mb-1">Bank Reference / M-Pesa Code</label>
            <input
              type="text"
              value={referenceNumber}
              onChange={(e) => setReferenceNumber(e.target.value)}
              required
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white font-mono uppercase"
            />
          </div>

          <div>
            <label className="text-[11px] text-slate-300 font-semibold block mb-1">Destination Bank Account</label>
            <select
              value={accountType}
              onChange={(e) => setAccountType(e.target.value as any)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
            >
              <option value="office">Office Operational Account (Earned Fees)</option>
              <option value="trust">Client Trust Account (Disbursement Float)</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold cursor-pointer"
            >
              Issue Payment Receipt
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
