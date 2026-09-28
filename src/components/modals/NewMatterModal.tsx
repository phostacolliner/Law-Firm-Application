import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MatterCategory, MatterPriority, MatterStatus } from '../../types';
import { Briefcase, X, Scale } from 'lucide-react';
import { DropdownDatePicker } from '../common/DropdownDatePicker';

interface NewMatterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewMatterModal: React.FC<NewMatterModalProps> = ({ isOpen, onClose }) => {
  const { clients, addMatter, setSelectedMatterId, setActiveTab } = useApp();

  const [clientId, setClientId] = useState(clients[0]?.id || '');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<MatterCategory>('Commercial');
  const [court, setCourt] = useState('Milimani Commercial Courts, Nairobi');
  const [caseNumber, setCaseNumber] = useState('HCCC No. E' + Math.floor(Math.random() * 800) + ' of 2026');
  const [opposingParty, setOpposingParty] = useState('');
  const [opposingAdvocate, setOpposingAdvocate] = useState('');
  const [priority, setPriority] = useState<MatterPriority>('High');
  const [status, setStatus] = useState<MatterStatus>('Active');
  const [estimatedValue, setEstimatedValue] = useState('2500000');
  const [nextAction, setNextAction] = useState('Draft Plaint & Notice of Intention to Sue');
  const [nextDeadline, setNextDeadline] = useState('2026-10-15');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const client = clients.find(c => c.id === clientId);
    if (!client || !title || !opposingParty) return;

    const newM = addMatter({
      clientId: client.id,
      clientName: client.name,
      title,
      category,
      court,
      caseNumber,
      opposingParty,
      opposingAdvocate: opposingAdvocate || 'Opposing Counsel',
      leadAdvocateId: 'u-1',
      leadAdvocateName: 'Phosta Colliner, SC',
      assignedClerkId: 'u-5',
      assignedClerkName: 'Brian Mutua',
      status,
      priority,
      estimatedValue: parseFloat(estimatedValue) || 0,
      nextAction,
      nextDeadline,
      notes
    });

    setSelectedMatterId(newM.id);
    setActiveTab('matters');
    onClose();
  };

  const categories: MatterCategory[] = [
    'Civil litigation', 'Commercial', 'Employment', 'Conveyancing', 'Land',
    'Succession', 'Debt recovery', 'Family', 'Criminal', 'Corporate', 'Constitutional', 'Intellectual property'
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 my-8">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-amber-400" />
            Open New Legal Matter File
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="text-[11px] text-slate-300 font-semibold block mb-1">Instructing Client</label>
            <select
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
            >
              {clients.map(c => (
                <option key={c.id} value={c.id}>{c.name} ({c.clientNumber})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[11px] text-slate-300 font-semibold block mb-1">Matter Title</label>
            <input
              type="text"
              placeholder="e.g. ABC Limited v. Apex Supermarkets Limited"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] text-slate-300 font-semibold block mb-1">Practice Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
              >
                {categories.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] text-slate-300 font-semibold block mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
              >
                <option value="Urgent">Urgent (Hearing within 7d)</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Normal">Normal</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] text-slate-300 font-semibold block mb-1">Court / Registry</label>
              <input
                type="text"
                value={court}
                onChange={(e) => setCourt(e.target.value)}
                required
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-300 font-semibold block mb-1">Court Case #</label>
              <input
                type="text"
                value={caseNumber}
                onChange={(e) => setCaseNumber(e.target.value)}
                required
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] text-slate-300 font-semibold block mb-1">Opposing Party</label>
              <input
                type="text"
                placeholder="e.g. Apex Supermarkets Limited"
                value={opposingParty}
                onChange={(e) => setOpposingParty(e.target.value)}
                required
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-300 font-semibold block mb-1">Opposing Advocate</label>
              <input
                type="text"
                placeholder="e.g. Kaplan & Stratton Advocates"
                value={opposingAdvocate}
                onChange={(e) => setOpposingAdvocate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] text-slate-300 font-semibold block mb-1">Estimated Value (KSh)</label>
              <input
                type="number"
                value={estimatedValue}
                onChange={(e) => setEstimatedValue(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white font-mono"
              />
            </div>
            <div>
              <DropdownDatePicker
                label="Next Action Deadline"
                value={nextDeadline}
                onChange={setNextDeadline}
                required={true}
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] text-slate-300 font-semibold block mb-1">Next Immediate Action</label>
            <input
              type="text"
              value={nextAction}
              onChange={(e) => setNextAction(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
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
              Open Matter File
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
