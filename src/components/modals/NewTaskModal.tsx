import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TaskPriority } from '../../types';
import { CheckSquare, X } from 'lucide-react';
import { DropdownDatePicker } from '../common/DropdownDatePicker';

interface NewTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMatterId?: string;
}

export const NewTaskModal: React.FC<NewTaskModalProps> = ({ 
  isOpen, 
  onClose, 
  defaultMatterId 
}) => {
  const { matters, addTask, setActiveTab } = useApp();

  const [matterId, setMatterId] = useState(defaultMatterId || matters[0]?.id || '');
  const [title, setTitle] = useState('');
  const [assignedName, setAssignedName] = useState('Brian Mutua');
  const [assignedRole, setAssignedRole] = useState('Legal Clerk');
  const [deadline, setNextDeadline] = useState('2026-10-05');
  const [priority, setPriority] = useState<TaskPriority>('High');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const matter = matters.find(m => m.id === matterId);
    if (!matter || !title) return;

    addTask({
      matterId: matter.id,
      matterNumber: matter.matterNumber,
      matterTitle: matter.title,
      title,
      assignedToId: 'u-5',
      assignedToName: assignedName,
      assignedRole,
      deadline,
      priority,
      status: 'Pending',
      notes
    });

    setActiveTab('tasks');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-amber-400" />
            Assign Action Task
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
                <option key={m.id} value={m.id}>{m.matterNumber}: {m.title.substring(0, 30)}...</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[11px] text-slate-300 font-semibold block mb-1">Task Action Title</label>
            <input
              type="text"
              placeholder="e.g. File Affidavit of Service at Milimani Commercial Registry"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] text-slate-300 font-semibold block mb-1">Assigned Team Member</label>
              <select
                value={assignedName}
                onChange={(e) => {
                  setAssignedName(e.target.value);
                  if (e.target.value === 'Brian Mutua') setAssignedRole('Legal Clerk');
                  else if (e.target.value === 'Phosta Colliner, SC') setAssignedRole('Managing Partner');
                  else if (e.target.value === 'David Kiprop') setAssignedRole('Senior Associate');
                  else if (e.target.value === 'Faith Akinyi') setAssignedRole('Associate Advocate');
                  else if (e.target.value === 'Beatrice Ndinda') setAssignedRole('Chief Accountant');
                }}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
              >
                <option value="Brian Mutua">Brian Mutua (Clerk)</option>
                <option value="Phosta Colliner, SC">Phosta Colliner, SC (Partner)</option>
                <option value="Jane Wanjiku Kamau">Jane Wanjiku Kamau (Partner)</option>
                <option value="David Kiprop">David Kiprop (Senior Assoc)</option>
                <option value="Faith Akinyi">Faith Akinyi (Associate)</option>
                <option value="Beatrice Ndinda">Beatrice Ndinda (Accounts)</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] text-slate-300 font-semibold block mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
              >
                <option value="Urgent">Urgent (Immediate)</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Normal">Normal</option>
              </select>
            </div>
          </div>

          <div>
            <DropdownDatePicker
              label="Due Deadline"
              value={deadline}
              onChange={setNextDeadline}
              required={true}
            />
          </div>

          <div>
            <label className="text-[11px] text-slate-300 font-semibold block mb-1">Instructions / Registry Particulars</label>
            <textarea
              placeholder="Provide filing instructions, court fee receipts required, or contacts..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white resize-none"
            />
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
              Assign Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
