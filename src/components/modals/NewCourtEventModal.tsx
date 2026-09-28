import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CourtEventType } from '../../types';
import { Calendar, X } from 'lucide-react';
import { DropdownDatePicker } from '../common/DropdownDatePicker';

interface NewCourtEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMatterId?: string;
}

export const NewCourtEventModal: React.FC<NewCourtEventModalProps> = ({ 
  isOpen, 
  onClose, 
  defaultMatterId 
}) => {
  const { matters, addCourtEvent, setActiveTab, setSelectedMatterId } = useApp();

  const [matterId, setMatterId] = useState(defaultMatterId || matters[0]?.id || '');
  const [eventType, setEventType] = useState<CourtEventType>('Hearing');
  const [date, setDate] = useState('2026-10-14');
  const [time, setTime] = useState('09:00 AM');
  const [courtRoom, setCourtRoom] = useState('Courtroom 3, Milimani');
  const [judgeName, setJudgeName] = useState('Hon. Lady Justice Wasilwa');
  const [advocateAssigned, setAdvocateAssigned] = useState('Phosta Colliner, SC');
  const [notes, setNotes] = useState('Trial hearing: Plaintiff witness testimony and tender of exhibits.');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const matter = matters.find(m => m.id === matterId);
    if (!matter) return;

    addCourtEvent({
      matterId: matter.id,
      matterNumber: matter.matterNumber,
      matterTitle: matter.title,
      eventType,
      court: matter.court,
      courtRoom,
      judgeName,
      date,
      time,
      advocateAssigned,
      status: 'Upcoming',
      notes,
      reminderDays: [30, 14, 7, 3, 1, 0]
    });

    setSelectedMatterId(matter.id);
    setActiveTab('diary');
    onClose();
  };

  const eventTypes: CourtEventType[] = [
    'Hearing', 'Mention', 'Ruling', 'Judgement', 'Pre-Trial Conference', 'Filing Deadline', 'Statutory Deadline'
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 my-8">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Calendar className="w-4 h-4 text-amber-400" />
            Docket Court Event or Filing Deadline
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
              <label className="text-[11px] text-slate-300 font-semibold block mb-1">Event Type</label>
              <select
                value={eventType}
                onChange={(e) => setEventType(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
              >
                {eventTypes.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] text-slate-300 font-semibold block mb-1">Assigned Counsel</label>
              <input
                type="text"
                value={advocateAssigned}
                onChange={(e) => setAdvocateAssigned(e.target.value)}
                required
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <DropdownDatePicker
                label="Scheduled Date"
                value={date}
                onChange={setDate}
                required={true}
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-300 font-semibold block mb-1">Court Time</label>
              <input
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] text-slate-300 font-semibold block mb-1">Courtroom / Virtual Link</label>
              <input
                type="text"
                value={courtRoom}
                onChange={(e) => setCourtRoom(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-300 font-semibold block mb-1">Judge / Magistrate</label>
              <input
                type="text"
                value={judgeName}
                onChange={(e) => setJudgeName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] text-slate-300 font-semibold block mb-1">Notes & Orders to Seek</label>
            <textarea
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
              Docket in Central Diary
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
