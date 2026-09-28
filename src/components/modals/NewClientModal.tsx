import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ClientType } from '../../types';
import { UserCheck, X } from 'lucide-react';

interface NewClientModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewClientModal: React.FC<NewClientModalProps> = ({ isOpen, onClose }) => {
  const { addClient, setSelectedClientId, setActiveTab } = useApp();

  const [name, setName] = useState('');
  const [type, setType] = useState<ClientType>('company');
  const [contactPerson, setContactPerson] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+254 7');
  const [address, setAddress] = useState('Nairobi, Kenya');
  const [idOrRegNumber, setIdOrRegNumber] = useState('');
  const [kraPin, setKraPin] = useState('P051');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    const newC = addClient({
      name,
      type,
      contactPerson,
      email,
      phone,
      address,
      idOrRegNumber: idOrRegNumber || (type === 'company' ? 'CPR/2026/001' : 'ID 29014120'),
      kraPin,
      status: 'active',
      portalAccess: true,
      notes
    });

    setSelectedClientId(newC.id);
    setActiveTab('clients');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 my-8">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-amber-400" />
            Client Intake & Registration
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] text-slate-300 font-semibold block mb-1">Client Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
              >
                <option value="company">Corporate / Company</option>
                <option value="individual">Individual</option>
                <option value="institution">Institution / Parastatal</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] text-slate-300 font-semibold block mb-1">
                {type === 'company' ? 'Company Name' : 'Full Legal Name'}
              </label>
              <input
                type="text"
                placeholder={type === 'company' ? 'e.g. Apex Holdings Limited' : 'e.g. Mary Wanjiku Gitau'}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
              />
            </div>
          </div>

          {type === 'company' && (
            <div>
              <label className="text-[11px] text-slate-300 font-semibold block mb-1">Managing Director / Contact Person</label>
              <input
                type="text"
                placeholder="e.g. Samuel Mutiso (CEO)"
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] text-slate-300 font-semibold block mb-1">Official Email</label>
              <input
                type="email"
                placeholder="client@domain.co.ke"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-300 font-semibold block mb-1">Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] text-slate-300 font-semibold block mb-1">
                {type === 'company' ? 'Company Reg # (CR12)' : 'National ID / Passport'}
              </label>
              <input
                type="text"
                placeholder={type === 'company' ? 'CPR/2022/98124' : 'ID 24890123'}
                value={idOrRegNumber}
                onChange={(e) => setIdOrRegNumber(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white font-mono"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-300 font-semibold block mb-1">KRA Tax PIN</label>
              <input
                type="text"
                value={kraPin}
                onChange={(e) => setKraPin(e.target.value)}
                required
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white font-mono uppercase"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] text-slate-300 font-semibold block mb-1">Physical / Chambers Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
            />
          </div>

          <div>
            <label className="text-[11px] text-slate-300 font-semibold block mb-1">Intake Notes / Billing Agreement</label>
            <textarea
              placeholder="Corporate retainer terms, standard hourly rates, or special handling instructions..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white resize-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
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
              Register Client & Grant Portal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
