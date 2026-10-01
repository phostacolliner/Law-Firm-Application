import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CourtEvent, CourtEventType } from '../../types';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Search, 
  Plus, 
  Filter, 
  AlertTriangle, 
  CheckCircle2, 
  Scale, 
  Building, 
  User, 
  ChevronLeft, 
  ChevronRight,
  ChevronDown,
  Bell,
  X
} from 'lucide-react';
import { DropdownDatePicker } from '../common/DropdownDatePicker';
import { SectorExportButton } from '../reports/SectorExportButton';

interface CourtDiaryProps {
  onOpenNewCourtEvent: (matterId?: string) => void;
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const CourtDiary: React.FC<CourtDiaryProps> = ({ onOpenNewCourtEvent }) => {
  const { courtEvents, setSelectedMatterId, setActiveTab } = useApp();

  const [filterAdvocate, setFilterAdvocate] = useState<string>('all');
  const [filterEventType, setFilterEventType] = useState<string>('all');
  const [filterCourt, setFilterCourt] = useState<string>('all');
  const [filterDate, setFilterDate] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'agenda' | 'calendar'>('agenda');

  // Month & Year state for Calendar View
  const [calYear, setCalYear] = useState<number>(2026);
  const [calMonth, setCalMonth] = useState<number>(8); // 8 = September (0-indexed)

  // Filter court events
  const filteredEvents = courtEvents.filter(e => {
    const matchesSearch = 
      e.matterTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.matterNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.court.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (e.judgeName && e.judgeName.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesAdvocate = filterAdvocate === 'all' || e.advocateAssigned.includes(filterAdvocate);
    const matchesType = filterEventType === 'all' || e.eventType === filterEventType;
    const matchesCourt = filterCourt === 'all' || e.court.includes(filterCourt);
    const matchesDate = !filterDate || e.date === filterDate;

    return matchesSearch && matchesAdvocate && matchesType && matchesCourt && matchesDate;
  }).sort((a, b) => a.date.localeCompare(b.date));

  // Tomorrow hearing highlight
  const hearingTomorrow = courtEvents.find(e => e.date === '2026-09-29' && e.eventType === 'Hearing');

  const eventTypes: CourtEventType[] = [
    'Hearing', 'Mention', 'Ruling', 'Judgement', 'Pre-Trial Conference', 'Filing Deadline', 'Statutory Deadline'
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-amber-400" />
            Central Court Diary & Legal Calendar
          </h1>
          <p className="text-xs text-slate-400">
            Automated statutory reminders (30d, 14d, 7d, 3d, 1d), judge allocations, and hearing docket
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex rounded-lg bg-slate-800 p-0.5 border border-slate-700 text-xs">
            <button
              onClick={() => setViewMode('agenda')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                viewMode === 'agenda' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Agenda Docket
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                viewMode === 'calendar' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Month View
            </button>
          </div>

          <SectorExportButton
            sectorKey="diary"
            reportTitle="Central Court Diary & Hearing Cause List"
            reportSubtitle="Official statutory cause list for trials, rulings, mentions, and advocate court appearances"
            sectorName="Court Diary & Registry"
            statutoryReference="Kenya Judiciary Practice Directions"
            filenamePrefix="LexisFirm_Cause_List"
            headers={['Date', 'Time', 'Matter No', 'Matter Title', 'Court & Room', 'Judge / Coram', 'Purpose', 'Assigned Advocate', 'Status', 'Virtual']}
            rows={filteredEvents.map(e => [
              e.date,
              e.time,
              e.matterNumber,
              e.matterTitle,
              `${e.court} (${e.courtRoom || e.room || 'Chambers'})`,
              e.judgeName || 'Hon. Judge / Coram',
              e.eventType,
              e.advocateAssigned,
              e.status,
              e.virtualLink ? 'Virtual (MS Teams)' : 'Physical Court'
            ])}
            summaryStats={[
              { label: 'Scheduled Hearings', value: filteredEvents.length, highlight: true },
              { label: 'Trials & Hearings', value: filteredEvents.filter(e => e.eventType === 'Hearing').length },
              { label: 'Rulings / Judgments', value: filteredEvents.filter(e => e.eventType === 'Ruling' || e.eventType === 'Judgement').length },
              { label: 'Virtual MS Teams', value: filteredEvents.filter(e => Boolean(e.virtualLink)).length }
            ]}
          />

          <button
            onClick={() => onOpenNewCourtEvent()}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Docket Court Date</span>
          </button>
        </div>
      </div>

      {/* Tomorrow Urgent Hearing Banner */}
      {hearingTomorrow && (
        <div className="bg-gradient-to-r from-rose-950/80 via-slate-900 to-slate-900 border-2 border-rose-500/60 rounded-xl p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-3 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/40 shrink-0">
              <AlertTriangle className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-black uppercase tracking-wider px-2 py-0.5 rounded bg-rose-600 text-white font-mono">
                  ⚠️ Court Hearing Tomorrow
                </span>
                <span className="text-xs font-bold text-rose-300">
                  Tuesday, 29 Sept 2026 • 09:00 AM EAT
                </span>
              </div>
              <h2 className="text-base font-bold text-white mt-1.5">
                {hearingTomorrow.matterTitle} ({hearingTomorrow.matterNumber})
              </h2>
              <div className="flex items-center gap-4 text-xs text-slate-300 mt-1 flex-wrap">
                <span>Court: <strong className="text-white">{hearingTomorrow.court}</strong></span>
                <span>Room: <strong className="text-amber-300">{hearingTomorrow.courtRoom || 'Court 4'}</strong></span>
                <span>Judge: <strong className="text-white">{hearingTomorrow.judgeName}</strong></span>
                <span>Assigned: <strong className="text-amber-400">{hearingTomorrow.advocateAssigned}</strong></span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 w-full md:w-auto">
            <button
              onClick={() => {
                setSelectedMatterId(hearingTomorrow.matterId);
                setActiveTab('matters');
              }}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-rose-600 hover:bg-rose-500 text-white transition-colors cursor-pointer"
            >
              Open Trial Bundle
            </button>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row gap-3 items-center justify-between shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search diary by matter, case #, court, or judge..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-amber-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap w-full md:w-auto">
          {/* Advocate Filter */}
          <select
            value={filterAdvocate}
            onChange={(e) => setFilterAdvocate(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-amber-500 cursor-pointer"
          >
            <option value="all">All Advocates</option>
            <option value="Phosta">Phosta Colliner, SC</option>
            <option value="Jane">Jane Wanjiku Kamau</option>
            <option value="David">David Kiprop Cheruiyot</option>
            <option value="Faith">Faith Akinyi Otieno</option>
          </select>

          {/* Event Type Filter */}
          <select
            value={filterEventType}
            onChange={(e) => setFilterEventType(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-amber-500 cursor-pointer"
          >
            <option value="all">All Event Types</option>
            {eventTypes.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>

          {/* Dropdown Calendar Date Picker (Click Date, Month, Year) */}
          <div className="w-44">
            <DropdownDatePicker
              value={filterDate}
              onChange={setFilterDate}
              placeholder="Filter by Date"
              align="right"
              showPresets={true}
            />
          </div>

          {filterDate && (
            <button
              onClick={() => setFilterDate('')}
              className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 cursor-pointer"
              title="Clear date filter"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Agenda Docket View */}
      {viewMode === 'agenda' ? (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
          <div className="p-4 bg-slate-850 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold uppercase tracking-wider text-[11px]">Upcoming Court Sessions & Deadlines</span>
            <span>{filteredEvents.length} events scheduled</span>
          </div>

          <div className="divide-y divide-slate-800/80">
            {filteredEvents.map(evt => {
              const isTomorrow = evt.date === '2026-09-29';
              return (
                <div
                  key={evt.id}
                  className={`p-4 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                    isTomorrow ? 'bg-rose-950/20' : 'hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Date Block */}
                    <div className={`w-14 h-14 rounded-xl flex flex-col items-center justify-center shrink-0 border font-mono ${
                      isTomorrow
                        ? 'bg-rose-600 text-white border-rose-500 shadow-md shadow-rose-950/50'
                        : 'bg-slate-800 text-slate-200 border-slate-700'
                    }`}>
                      <span className="text-[10px] uppercase font-bold">
                        {new Date(evt.date).toLocaleDateString('en-GB', { month: 'short' })}
                      </span>
                      <span className="text-lg font-black leading-none">
                        {new Date(evt.date).getDate()}
                      </span>
                    </div>

                    {/* Particulars */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-[10px] font-black font-mono uppercase px-2 py-0.5 rounded ${
                          evt.eventType === 'Hearing' ? 'bg-rose-500 text-white' :
                          evt.eventType === 'Mention' ? 'bg-blue-500 text-white' :
                          evt.eventType === 'Ruling' ? 'bg-purple-500 text-white' :
                          'bg-amber-500 text-slate-950'
                        }`}>
                          {evt.eventType}
                        </span>
                        <span className="text-xs font-mono text-amber-300 font-semibold">{evt.time}</span>
                        <span className="text-[11px] font-mono text-slate-400">({evt.matterNumber})</span>
                      </div>

                      <h3 className="text-sm font-bold text-white">{evt.matterTitle}</h3>

                      <p className="text-xs text-slate-300">
                        {evt.court} {evt.courtRoom ? `• ${evt.courtRoom}` : ''}
                      </p>

                      <div className="flex items-center gap-3 text-[11px] text-slate-400 flex-wrap">
                        {evt.judgeName && (
                          <span>Before: <strong className="text-slate-200">{evt.judgeName}</strong></span>
                        )}
                        <span>Counsel: <strong className="text-amber-400">{evt.advocateAssigned}</strong></span>
                      </div>

                      {evt.notes && (
                        <p className="text-[11px] text-slate-400 italic pt-1">{evt.notes}</p>
                      )}
                    </div>
                  </div>

                  {/* Actions & Reminder pill */}
                  <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                    <div className="text-right hidden sm:block">
                      <span className="text-[10px] font-mono text-slate-400 block">Automated Alert</span>
                      <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                        <Bell className="w-3 h-3" />
                        Active
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedMatterId(evt.matterId);
                        setActiveTab('matters');
                      }}
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer"
                    >
                      View Matter File →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Calendar Month Grid with Interactive Dropdowns */
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-800">
            {/* Clickable Month & Year Dropdown Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (calMonth === 0) {
                    setCalMonth(11);
                    setCalYear(prev => prev - 1);
                  } else {
                    setCalMonth(prev => prev - 1);
                  }
                }}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                title="Previous month"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Month Dropdown */}
              <div className="relative">
                <select
                  value={calMonth}
                  onChange={(e) => setCalMonth(Number(e.target.value))}
                  className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs font-bold text-white focus:outline-none focus:border-amber-500 cursor-pointer appearance-none pr-7"
                >
                  {MONTH_NAMES.map((m, idx) => (
                    <option key={m} value={idx} className="bg-slate-900 text-white">
                      {m}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-2.5 pointer-events-none" />
              </div>

              {/* Year Dropdown */}
              <div className="relative">
                <select
                  value={calYear}
                  onChange={(e) => setCalYear(Number(e.target.value))}
                  className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs font-bold text-amber-300 font-mono focus:outline-none focus:border-amber-500 cursor-pointer appearance-none pr-7"
                >
                  {[2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030, 2031, 2032].map((y) => (
                    <option key={y} value={y} className="bg-slate-900 text-white">
                      {y}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-2.5 pointer-events-none" />
              </div>

              <button
                onClick={() => {
                  if (calMonth === 11) {
                    setCalMonth(0);
                    setCalYear(prev => prev + 1);
                  } else {
                    setCalMonth(prev => prev + 1);
                  }
                }}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                title="Next month"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  setCalYear(2026);
                  setCalMonth(8);
                }}
                className="text-[11px] font-semibold text-amber-400 hover:underline px-2 py-1 rounded bg-amber-500/10 border border-amber-500/20 cursor-pointer"
              >
                Current Term (Sep 2026)
              </button>
            </div>

            <div className="text-xs text-slate-400">
              Click any date to filter the court docket or view hearings
            </div>
          </div>

          {/* Days of Week Header */}
          <div className="grid grid-cols-7 gap-2 text-center text-xs">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
              <div key={d} className="py-2 font-bold text-slate-400 uppercase text-[10px] bg-slate-950/40 rounded">
                {d}
              </div>
            ))}

            {/* Dynamic Calendar Days */}
            {(() => {
              const daysInCurrentMonth = new Date(calYear, calMonth + 1, 0).getDate();
              const firstDayIndex = (() => {
                const day = new Date(calYear, calMonth, 1).getDay();
                return day === 0 ? 6 : day - 1; // Mon=0, Sun=6
              })();

              const prevDaysInMonth = new Date(calYear, calMonth, 0).getDate();
              const cells = [];

              // Leading padding days from previous month
              for (let i = 0; i < firstDayIndex; i++) {
                const prevDayNum = prevDaysInMonth - firstDayIndex + i + 1;
                cells.push(
                  <div
                    key={`prev-${i}`}
                    className="min-h-[95px] p-2 rounded-lg border border-slate-900 bg-slate-950/30 text-slate-600 opacity-40 text-left"
                  >
                    <span className="text-xs font-mono">{prevDayNum}</span>
                  </div>
                );
              }

              // Days of current month
              for (let d = 1; d <= daysInCurrentMonth; d++) {
                const dateStr = `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
                const dayEvents = courtEvents.filter(e => e.date === dateStr);
                const isToday = dateStr === '2026-09-28';
                const isSelected = filterDate === dateStr;

                cells.push(
                  <div
                    key={`day-${d}`}
                    onClick={() => {
                      if (filterDate === dateStr) {
                        setFilterDate('');
                      } else {
                        setFilterDate(dateStr);
                      }
                    }}
                    className={`min-h-[95px] p-2 rounded-lg border text-left flex flex-col justify-between transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-amber-500/20 border-amber-500 ring-1 ring-amber-500 shadow-md'
                        : isToday
                        ? 'bg-amber-500/10 border-amber-500/50'
                        : dayEvents.length > 0
                        ? 'bg-slate-800/60 border-slate-700 hover:border-amber-400'
                        : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-mono font-bold ${
                        isSelected ? 'text-amber-300' : isToday ? 'text-amber-400' : 'text-slate-300'
                      }`}>
                        {d}
                      </span>
                      {isToday && (
                        <span className="text-[8px] uppercase font-bold px-1 rounded bg-amber-500 text-slate-950">
                          Today
                        </span>
                      )}
                      {dayEvents.length > 0 && !isToday && (
                        <span className="text-[8px] font-bold px-1 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                          {dayEvents.length} {dayEvents.length === 1 ? 'cause' : 'causes'}
                        </span>
                      )}
                    </div>

                    <div className="space-y-1 mt-1">
                      {dayEvents.map(e => (
                        <div
                          key={e.id}
                          onClick={(ev) => {
                            ev.stopPropagation();
                            setSelectedMatterId(e.matterId);
                            setActiveTab('matters');
                          }}
                          className={`text-[9px] p-1 rounded border truncate hover:border-amber-400 transition-colors ${
                            e.eventType === 'Hearing'
                              ? 'bg-rose-950/60 border-rose-500/40 text-rose-200'
                              : e.eventType === 'Ruling' || e.eventType === 'Judgement'
                              ? 'bg-purple-950/60 border-purple-500/40 text-purple-200'
                              : 'bg-slate-900 border-slate-700 text-slate-200'
                          }`}
                          title={`${e.time} - ${e.eventType}: ${e.matterTitle}`}
                        >
                          <strong>{e.time.split(' ')[0]}</strong> {e.eventType}: {e.matterTitle.substring(0, 14)}...
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }

              return cells;
            })()}
          </div>
        </div>
      )}
    </div>
  );
};
