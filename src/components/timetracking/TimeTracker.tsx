import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { TimeEntry } from '../../types';
import { 
  Timer, 
  Play, 
  Pause, 
  RotateCcw, 
  Plus, 
  Search, 
  Clock, 
  CheckCircle2, 
  Receipt, 
  DollarSign, 
  User, 
  Briefcase,
  X
} from 'lucide-react';
import { DropdownDatePicker } from '../common/DropdownDatePicker';
import { SectorExportButton } from '../reports/SectorExportButton';

export const TimeTracker: React.FC = () => {
  const { 
    timeEntries, 
    addTimeEntry, 
    markTimeEntryBilled, 
    addInvoice, 
    matters, 
    currentUser, 
    setActiveTab, 
    formatKSh 
  } = useApp();

  // Stopwatch state
  const [seconds, setSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerMatterId, setTimerMatterId] = useState(matters[0]?.id || '');
  const [timerActivity, setTimerActivity] = useState<TimeEntry['activity']>('Legal Research');

  // Manual Entry Form State
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [manualMatterId, setManualMatterId] = useState(matters[0]?.id || '');
  const [manualActivity, setManualActivity] = useState<TimeEntry['activity']>('Drafting Pleadings');
  const [manualHours, setManualHours] = useState('');
  const [manualNotes, setManualNotes] = useState('');
  const [manualDate, setManualDate] = useState('2026-09-28');

  // Filter state
  const [filterDate, setFilterDate] = useState('');

  // Live stopwatch counter
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setSeconds(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const formatTimerDisplay = (sec: number) => {
    const hrs = Math.floor(sec / 3600);
    const mins = Math.floor((sec % 3600) / 60);
    const secs = sec % 60;
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const getAdvocateRate = () => {
    if (currentUser.role === 'managing_partner') return 35000;
    if (currentUser.role === 'partner') return 25000;
    if (currentUser.role === 'associate') return 18000;
    return 10000;
  };

  const handleCommitStopwatch = () => {
    if (seconds < 10) {
      alert('Tracked duration is too short to log billable units (minimum 10 seconds).');
      return;
    }
    const matter = matters.find(m => m.id === timerMatterId);
    if (!matter) return;

    const hours = parseFloat((seconds / 3600).toFixed(2));
    addTimeEntry({
      matterId: matter.id,
      matterNumber: matter.matterNumber,
      matterTitle: matter.title,
      advocateId: currentUser.id,
      advocateName: currentUser.name,
      activity: timerActivity,
      hours: Math.max(0.1, hours),
      hourlyRate: getAdvocateRate(),
      billable: true,
      date: new Date().toISOString().split('T')[0],
      notes: `Recorded via live timer on ${new Date().toLocaleDateString('en-GB')}`
    });

    setIsTimerRunning(false);
    setSeconds(0);
  };

  const handleManualEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualHours) return;

    const matter = matters.find(m => m.id === manualMatterId);
    if (!matter) return;

    addTimeEntry({
      matterId: matter.id,
      matterNumber: matter.matterNumber,
      matterTitle: matter.title,
      advocateId: currentUser.id,
      advocateName: currentUser.name,
      activity: manualActivity,
      hours: parseFloat(manualHours),
      hourlyRate: getAdvocateRate(),
      billable: true,
      date: manualDate || new Date().toISOString().split('T')[0],
      notes: manualNotes
    });

    setIsManualModalOpen(false);
    setManualHours('');
    setManualNotes('');
  };

  const handleGenerateInvoiceFromUnbilled = () => {
    const unbilledEntries = timeEntries.filter(t => t.status === 'unbilled');
    if (unbilledEntries.length === 0) {
      alert('No unbilled time entries available to convert to a Fee Note.');
      return;
    }

    const firstMatterId = unbilledEntries[0].matterId;
    const matter = matters.find(m => m.id === firstMatterId);
    if (!matter) return;

    const matterUnbilled = unbilledEntries.filter(t => t.matterId === firstMatterId);
    const feeItems = matterUnbilled.map((entry, idx) => ({
      id: `fi-time-${idx}-${Date.now()}`,
      description: `${entry.activity}: ${entry.hours} hrs @ ${formatKSh(entry.hourlyRate)}/hr (${entry.advocateName})`,
      type: 'professional_fee' as const,
      amount: entry.hours * entry.hourlyRate
    }));

    const subtotal = feeItems.reduce((acc, f) => acc + f.amount, 0);

    addInvoice({
      matterId: matter.id,
      matterNumber: matter.matterNumber,
      matterTitle: matter.title,
      clientId: matter.clientId,
      clientName: matter.clientName,
      clientAddress: 'Chambers Registered Client Address, Nairobi',
      clientPin: 'P051289341X',
      dateIssued: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      status: 'Sent',
      items: feeItems,
      subtotal,
      applyVat: false,
      vatRate: 16,
      vatAmount: 0,
      totalAmount: subtotal,
      amountPaid: 0,
      balanceDue: subtotal,
      notes: 'Fee note generated automatically from billable advocate timesheets.'
    });

    // Mark these as billed
    matterUnbilled.forEach(e => markTimeEntryBilled(e.id));
    setActiveTab('billing');
  };

  const totalBillableHours = timeEntries.reduce((acc, t) => acc + (t.billable ? t.hours : 0), 0);
  const unbilledValue = timeEntries
    .filter(t => t.status === 'unbilled' && t.billable)
    .reduce((acc, t) => acc + (t.hours * t.hourlyRate), 0);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Timer className="w-5 h-5 text-amber-400" />
            Time Tracking & Billable Rates
          </h1>
          <p className="text-xs text-slate-400">
            Precision stopwatch, advocate billing rates, and one-click Fee Note generation
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <SectorExportButton
            sectorKey="timetracking"
            reportTitle="Advocate Billable Hours & Time Utilization Report"
            reportSubtitle="Timesheet activity log, fee calculations, and work-in-progress reconciliation"
            sectorName="Time & Utilization"
            statutoryReference="Advocates Practice Standards"
            filenamePrefix="LexisFirm_Timesheets"
            headers={['Date', 'Fee Earner', 'Matter No', 'Matter Title', 'Activity Description', 'Hours', 'Rate (KES/hr)', 'Total Fee (KES)', 'Status']}
            rows={timeEntries.map(t => [
              t.date,
              t.advocateName,
              t.matterNumber,
              t.matterTitle,
              t.notes || t.activity,
              t.hours.toFixed(1),
              t.hourlyRate.toLocaleString(),
              (t.hours * t.hourlyRate).toLocaleString(),
              t.status === 'billed' ? 'Billed' : 'Unbilled WIP'
            ])}
            summaryStats={[
              { label: 'Total Billable Hours', value: `${totalBillableHours} hrs`, highlight: true },
              { label: 'Unbilled WIP Value', value: formatKSh(unbilledValue), highlight: unbilledValue > 0 },
              { label: 'Logged Entries', value: timeEntries.length }
            ]}
          />

          <button
            onClick={handleGenerateInvoiceFromUnbilled}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-colors cursor-pointer"
          >
            <Receipt className="w-3.5 h-3.5" />
            <span>Convert Unbilled Time to Fee Note</span>
          </button>

          <button
            onClick={() => setIsManualModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Manual Time Entry</span>
          </button>
        </div>
      </div>

      {/* Live Stopwatch Widget Card */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/20 border-2 border-amber-500/40 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              Active Billable Advocate Timer
            </span>
            <div className="font-mono text-4xl sm:text-5xl font-black text-white tracking-wider">
              {formatTimerDisplay(seconds)}
            </div>
            <p className="text-xs text-slate-400">
              Fee Earner: <strong className="text-slate-200">{currentUser.name}</strong> • Standard Rate: <strong className="text-emerald-400 font-mono">{formatKSh(getAdvocateRate())}/hr</strong>
            </p>
          </div>

          <div className="flex-1 max-w-md space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div>
                <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">Matter</label>
                <select
                  value={timerMatterId}
                  onChange={(e) => setTimerMatterId(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-white"
                >
                  {matters.map(m => (
                    <option key={m.id} value={m.id}>{m.matterNumber}: {m.title.substring(0, 25)}...</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">Activity</label>
                <select
                  value={timerActivity}
                  onChange={(e) => setTimerActivity(e.target.value as any)}
                  className="w-full px-2.5 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-white"
                >
                  <option value="Legal Research">Legal Research</option>
                  <option value="Drafting Pleadings">Drafting Pleadings</option>
                  <option value="Court Attendance">Court Attendance</option>
                  <option value="Client Meeting">Client Meeting</option>
                  <option value="Consultation">Consultation</option>
                  <option value="Registry Filing">Registry Filing</option>
                </select>
              </div>
            </div>

            {/* Timer Controls */}
            <div className="flex items-center gap-2 pt-1">
              {!isTimerRunning ? (
                <button
                  onClick={() => setIsTimerRunning(true)}
                  className="flex-1 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>Start Live Timer</span>
                </button>
              ) : (
                <button
                  onClick={() => setIsTimerRunning(false)}
                  className="flex-1 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <Pause className="w-4 h-4 fill-slate-950" />
                  <span>Pause Timer</span>
                </button>
              )}

              <button
                onClick={handleCommitStopwatch}
                disabled={seconds < 10}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 font-semibold text-xs border border-amber-500/30 cursor-pointer disabled:opacity-40"
              >
                Commit Units
              </button>

              <button
                onClick={() => { setIsTimerRunning(false); setSeconds(0); }}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 cursor-pointer"
                title="Reset stopwatch"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Tracked Hours</span>
          <p className="text-xl font-bold text-white font-mono mt-2">{totalBillableHours.toFixed(1)} hrs</p>
          <p className="text-[11px] text-slate-400 mt-1">Across all active matters</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Unbilled Billable Value (WIP)</span>
          <p className="text-xl font-bold text-amber-300 font-mono mt-2">{formatKSh(unbilledValue)}</p>
          <p className="text-[11px] text-amber-400/80 mt-1">Ready for automated Fee Note generation</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Realization Benchmark</span>
          <p className="text-xl font-bold text-emerald-300 font-mono mt-2">KSh 35,000 / hr</p>
          <p className="text-[11px] text-slate-400 mt-1">Senior Counsel standard scale</p>
        </div>
      </div>

      {/* Time Entries Journal */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 bg-slate-850 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-400">
          <div>
            <span className="font-semibold uppercase tracking-wider text-[11px] text-white">Advocate Time Journal</span>
            <span className="ml-2 text-slate-400">
              ({timeEntries.filter(t => !filterDate || t.date === filterDate).length} entries recorded)
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
                <th className="p-3">Date</th>
                <th className="p-3">Matter Reference</th>
                <th className="p-3">Fee Earner</th>
                <th className="p-3">Activity</th>
                <th className="p-3 text-right">Hours</th>
                <th className="p-3 text-right">Rate</th>
                <th className="p-3 text-right">Amount (KSh)</th>
                <th className="p-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {timeEntries
                .filter(entry => !filterDate || entry.date === filterDate)
                .map(entry => {
                const total = entry.hours * entry.hourlyRate;
                return (
                  <tr key={entry.id} className="hover:bg-slate-800/40">
                    <td className="p-3 text-slate-400">{entry.date}</td>
                    <td className="p-3 font-sans">
                      <span className="font-semibold text-white block">{entry.matterTitle}</span>
                      <span className="text-[10px] text-amber-400">{entry.matterNumber}</span>
                    </td>
                    <td className="p-3 font-sans text-slate-300">{entry.advocateName}</td>
                    <td className="p-3 font-sans">
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-200">
                        {entry.activity}
                      </span>
                    </td>
                    <td className="p-3 text-right text-slate-200 font-bold">{entry.hours} hrs</td>
                    <td className="p-3 text-right text-slate-400">{formatKSh(entry.hourlyRate)}</td>
                    <td className="p-3 text-right text-emerald-400 font-bold">{formatKSh(total)}</td>
                    <td className="p-3 text-center">
                      <span className={`text-[9px] px-2 py-0.5 rounded uppercase font-bold ${
                        entry.status === 'billed'
                          ? 'bg-slate-800 text-slate-400'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}>
                        {entry.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Time Entry Modal */}
      {isManualModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Manual Advocate Time Entry
              </h3>
              <button onClick={() => setIsManualModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleManualEntry} className="space-y-4 text-xs">
              <div>
                <label className="text-[11px] text-slate-300 font-semibold block mb-1">Matter</label>
                <select
                  value={manualMatterId}
                  onChange={(e) => setManualMatterId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                >
                  {matters.map(m => (
                    <option key={m.id} value={m.id}>{m.matterNumber}: {m.title.substring(0, 30)}...</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] text-slate-300 font-semibold block mb-1">Activity</label>
                <select
                  value={manualActivity}
                  onChange={(e) => setManualActivity(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                >
                  <option value="Drafting Pleadings">Drafting Pleadings</option>
                  <option value="Legal Research">Legal Research</option>
                  <option value="Court Attendance">Court Attendance</option>
                  <option value="Client Meeting">Client Meeting</option>
                  <option value="Consultation">Consultation</option>
                  <option value="Registry Filing">Registry Filing</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <DropdownDatePicker
                    label="Date Worked"
                    value={manualDate}
                    onChange={setManualDate}
                    required={true}
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-300 font-semibold block mb-1">Duration (Hours)</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="e.g. 2.5"
                    value={manualHours}
                    onChange={(e) => setManualHours(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] text-slate-300 font-semibold block mb-1">Work Description / Details</label>
                <textarea
                  placeholder="e.g. Researched Court of Appeal authorities on interlocutory injunctions in land disputes."
                  value={manualNotes}
                  onChange={(e) => setManualNotes(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsManualModalOpen(false)}
                  className="px-3 py-2 rounded-lg bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold cursor-pointer"
                >
                  Log Billable Time
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
