import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FeeItem } from '../../types';
import { Receipt, Plus, Trash2, X } from 'lucide-react';
import { DropdownDatePicker } from '../common/DropdownDatePicker';

interface NewInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMatterId?: string;
}

export const NewInvoiceModal: React.FC<NewInvoiceModalProps> = ({ 
  isOpen, 
  onClose, 
  defaultMatterId 
}) => {
  const { matters, clients, addInvoice, setActiveTab } = useApp();

  const [matterId, setMatterId] = useState(defaultMatterId || matters[0]?.id || '');
  const [applyVat, setApplyVat] = useState(true);
  const [dueDate, setDueDate] = useState('2026-10-30');
  const [items, setItems] = useState<Omit<FeeItem, 'id'>[]>([
    { description: 'Professional Legal Fees (Advocates Remuneration Order)', type: 'professional_fee', amount: 200000 },
    { description: 'Statutory Registry Filing Fees & E-filing Assessment', type: 'court_fee', amount: 25000 },
    { description: 'Process Server Disbursements & Travel Outlays', type: 'disbursement', amount: 15000 }
  ]);

  if (!isOpen) return null;

  const matter = matters.find(m => m.id === matterId) || matters[0];
  const client = clients.find(c => c.id === matter?.clientId) || clients[0];

  const addItem = () => {
    setItems([...items, { description: 'Disbursements & Search Fees', type: 'disbursement', amount: 10000 }]);
  };

  const removeItem = (idx: number) => {
    setItems(items.filter((_, i) => i !== idx));
  };

  const updateItem = (idx: number, field: string, value: any) => {
    setItems(items.map((item, i) => i === idx ? { ...item, [field]: value } : item));
  };

  const subtotal = items.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
  const vatAmount = applyVat ? subtotal * 0.16 : 0;
  const totalAmount = subtotal + vatAmount;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!matter || items.length === 0) return;

    addInvoice({
      matterId: matter.id,
      matterNumber: matter.matterNumber,
      matterTitle: matter.title,
      clientId: client.id,
      clientName: client.name,
      clientAddress: client.address,
      clientPin: client.kraPin,
      dateIssued: new Date().toISOString().split('T')[0],
      dueDate,
      status: 'Sent',
      items: items.map((it, idx) => ({ ...it, id: `fi-${idx}-${Date.now()}` })),
      subtotal,
      applyVat,
      vatRate: 16,
      vatAmount,
      totalAmount,
      amountPaid: 0,
      balanceDue: totalAmount,
      notes: 'Fee note payable within 30 days pursuant to Section 48 of the Advocates Act.'
    });

    setActiveTab('billing');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 my-8">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Receipt className="w-4 h-4 text-amber-400" />
            Issue Advocate Fee Note & Disbursements
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="text-[11px] text-slate-300 font-semibold block mb-1">Matter Reference</label>
            <select
              value={matterId}
              onChange={(e) => setMatterId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
            >
              {matters.map(m => (
                <option key={m.id} value={m.id}>{m.matterNumber}: {m.title.substring(0, 35)}...</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <DropdownDatePicker
                label="Due Date"
                value={dueDate}
                onChange={setDueDate}
                required={true}
              />
            </div>
            <div className="flex items-center gap-2 pt-6">
              <input
                type="checkbox"
                id="applyVat"
                checked={applyVat}
                onChange={(e) => setApplyVat(e.target.checked)}
                className="w-4 h-4 accent-amber-500 rounded"
              />
              <label htmlFor="applyVat" className="text-slate-300 font-semibold">Apply VAT (16%)</label>
            </div>
          </div>

          {/* Fee Items */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-300 font-bold uppercase tracking-wider">Itemized Fees & Outlays</span>
              <button
                type="button"
                onClick={addItem}
                className="text-[11px] text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Item</span>
              </button>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-slate-800/60 p-2 rounded-lg border border-slate-700">
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => updateItem(idx, 'description', e.target.value)}
                    placeholder="Description..."
                    className="flex-1 px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded text-white text-xs"
                  />
                  <input
                    type="number"
                    value={item.amount}
                    onChange={(e) => updateItem(idx, 'amount', parseFloat(e.target.value) || 0)}
                    placeholder="Amount"
                    className="w-28 px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded text-white text-xs font-mono text-right"
                  />
                  <button
                    type="button"
                    onClick={() => removeItem(idx)}
                    className="p-1.5 text-slate-400 hover:text-rose-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Total Calculation Summary */}
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1 font-mono text-xs">
            <div className="flex justify-between text-slate-400">
              <span>Subtotal:</span>
              <span>KSh {subtotal.toLocaleString()}</span>
            </div>
            {applyVat && (
              <div className="flex justify-between text-slate-400">
                <span>VAT (16%):</span>
                <span>KSh {vatAmount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-emerald-400 text-sm pt-1 border-t border-slate-800">
              <span>Grand Total:</span>
              <span>KSh {totalAmount.toLocaleString()}</span>
            </div>
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
              className="px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold cursor-pointer"
            >
              Generate Fee Note
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
