import React, { useState, useRef, useEffect } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  X,
  Clock
} from 'lucide-react';

export interface DropdownDatePickerProps {
  value: string; // Format: YYYY-MM-DD
  onChange: (date: string) => void;
  label?: string;
  placeholder?: string;
  minYear?: number;
  maxYear?: number;
  className?: string;
  required?: boolean;
  disabled?: boolean;
  showPresets?: boolean;
  align?: 'left' | 'right';
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const SHORT_DAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

export const DropdownDatePicker: React.FC<DropdownDatePickerProps> = ({
  value,
  onChange,
  label,
  placeholder = 'Select date',
  minYear = 2018,
  maxYear = 2036,
  className = '',
  required = false,
  disabled = false,
  showPresets = true,
  align = 'left'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Parse initial date or default to 2026-09-28
  const parsedDate = value ? new Date(value + 'T00:00:00') : new Date('2026-09-28T00:00:00');
  const validParsed = !isNaN(parsedDate.getTime()) ? parsedDate : new Date('2026-09-28T00:00:00');

  const [currentYear, setCurrentYear] = useState<number>(validParsed.getFullYear());
  const [currentMonth, setCurrentMonth] = useState<number>(validParsed.getMonth()); // 0-11

  // Keep year and month in sync when value changes externally
  useEffect(() => {
    if (value) {
      const d = new Date(value + 'T00:00:00');
      if (!isNaN(d.getTime())) {
        setCurrentYear(d.getFullYear());
        setCurrentMonth(d.getMonth());
      }
    }
  }, [value]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Generate Year Options
  const years: number[] = [];
  for (let y = minYear; y <= maxYear; y++) {
    years.push(y);
  }

  // Prev / Next Month
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(prev => prev - 1);
    } else {
      setCurrentMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(prev => prev + 1);
    } else {
      setCurrentMonth(prev => prev + 1);
    }
  };

  // Calculate calendar days
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Day of week for 1st of month: 0 (Sun) to 6 (Sat)
  // Convert so Monday is 0, Sunday is 6
  const getFirstDayOfWeek = (year: number, month: number) => {
    const day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1;
  };

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const startDay = getFirstDayOfWeek(currentYear, currentMonth);
  const prevMonthDays = getDaysInMonth(
    currentMonth === 0 ? currentYear - 1 : currentYear,
    currentMonth === 0 ? 11 : currentMonth - 1
  );

  const handleSelectDay = (day: number) => {
    const mStr = String(currentMonth + 1).padStart(2, '0');
    const dStr = String(day).padStart(2, '0');
    const formatted = `${currentYear}-${mStr}-${dStr}`;
    onChange(formatted);
    setIsOpen(false);
  };

  const setPreset = (offsetDays: number) => {
    const base = new Date('2026-09-28T00:00:00');
    base.setDate(base.getDate() + offsetDays);
    const y = base.getFullYear();
    const m = String(base.getMonth() + 1).padStart(2, '0');
    const d = String(base.getDate()).padStart(2, '0');
    const formatted = `${y}-${m}-${d}`;
    setCurrentYear(y);
    setCurrentMonth(base.getMonth());
    onChange(formatted);
    setIsOpen(false);
  };

  const formatDisplay = (dateStr: string) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr + 'T00:00:00');
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('en-KE', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {label && (
        <label className="block text-xs font-medium text-slate-300 mb-1">
          {label} {required && <span className="text-rose-400">*</span>}
        </label>
      )}

      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between gap-2 px-3 py-2 bg-slate-900 border rounded-lg text-xs font-sans transition-all cursor-pointer ${
          isOpen
            ? 'border-amber-500 ring-1 ring-amber-500/30 text-white'
            : 'border-slate-700 text-slate-200 hover:border-slate-600'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <div className="flex items-center gap-2 truncate">
          <CalendarIcon className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span className={value ? 'text-white font-medium' : 'text-slate-500'}>
            {value ? formatDisplay(value) : placeholder}
          </span>
          {value && (
            <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">
              ({value})
            </span>
          )}
        </div>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isOpen ? 'rotate-180 text-amber-400' : ''}`} />
      </button>

      {/* Dropdown Calendar Popup */}
      {isOpen && (
        <div
          className={`absolute mt-1.5 z-50 w-72 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-3.5 animate-in fade-in zoom-in-95 duration-100 ${
            align === 'right' ? 'right-0' : 'left-0'
          }`}
        >
          {/* Month & Year Selectors Bar */}
          <div className="flex items-center justify-between gap-1.5 pb-2.5 border-b border-slate-800">
            <button
              type="button"
              onClick={handlePrevMonth}
              title="Previous month"
              className="p-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Clickable Month & Year Dropdown Selectors */}
            <div className="flex items-center gap-1.5 flex-1 justify-center">
              {/* Month Dropdown */}
              <div className="relative">
                <select
                  value={currentMonth}
                  onChange={(e) => setCurrentMonth(Number(e.target.value))}
                  className="bg-slate-800 border border-slate-700 rounded-md px-2 py-1 text-xs font-bold text-white focus:outline-none focus:border-amber-500 cursor-pointer appearance-none pr-5"
                >
                  {MONTH_NAMES.map((m, idx) => (
                    <option key={m} value={idx} className="bg-slate-900 text-white">
                      {m}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3 h-3 text-slate-400 absolute right-1.5 top-2 pointer-events-none" />
              </div>

              {/* Year Dropdown */}
              <div className="relative">
                <select
                  value={currentYear}
                  onChange={(e) => setCurrentYear(Number(e.target.value))}
                  className="bg-slate-800 border border-slate-700 rounded-md px-2 py-1 text-xs font-bold text-amber-300 font-mono focus:outline-none focus:border-amber-500 cursor-pointer appearance-none pr-5"
                >
                  {years.map((y) => (
                    <option key={y} value={y} className="bg-slate-900 text-white">
                      {y}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3 h-3 text-slate-400 absolute right-1.5 top-2 pointer-events-none" />
              </div>
            </div>

            <button
              type="button"
              onClick={handleNextMonth}
              title="Next month"
              className="p-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Weekday Labels (Mo - Su) */}
          <div className="grid grid-cols-7 gap-1 text-center py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            {SHORT_DAYS.map((d) => (
              <span key={d}>{d}</span>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Leading days from previous month */}
            {Array.from({ length: startDay }).map((_, i) => {
              const dayNum = prevMonthDays - startDay + i + 1;
              return (
                <button
                  key={`prev-${i}`}
                  type="button"
                  onClick={() => {
                    handlePrevMonth();
                    setTimeout(() => handleSelectDay(dayNum), 50);
                  }}
                  className="h-7 rounded text-[11px] text-slate-600 hover:text-slate-400 hover:bg-slate-800/40 transition-colors flex items-center justify-center cursor-pointer"
                >
                  {dayNum}
                </button>
              );
            })}

            {/* Current month days */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
              const isSelected = value === dateStr;
              const isToday = dateStr === '2026-09-28';

              return (
                <button
                  key={`curr-${dayNum}`}
                  type="button"
                  onClick={() => handleSelectDay(dayNum)}
                  className={`h-7 rounded text-xs font-semibold flex items-center justify-center transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                      : isToday
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
                      : 'text-slate-200 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  {dayNum}
                </button>
              );
            })}
          </div>

          {/* Quick Presets Bar */}
          {showPresets && (
            <div className="mt-3 pt-2.5 border-t border-slate-800 flex flex-wrap items-center justify-between gap-1 text-[10px]">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setPreset(0)}
                  className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 font-semibold cursor-pointer"
                >
                  Today
                </button>
                <button
                  type="button"
                  onClick={() => setPreset(1)}
                  className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium cursor-pointer"
                >
                  Tomorrow
                </button>
                <button
                  type="button"
                  onClick={() => setPreset(7)}
                  className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium cursor-pointer"
                >
                  +7d
                </button>
                <button
                  type="button"
                  onClick={() => setPreset(14)}
                  className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium cursor-pointer"
                >
                  +14d
                </button>
                <button
                  type="button"
                  onClick={() => setPreset(30)}
                  className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium cursor-pointer"
                >
                  +30d
                </button>
              </div>

              {value && !required && (
                <button
                  type="button"
                  onClick={() => {
                    onChange('');
                    setIsOpen(false);
                  }}
                  className="px-1.5 py-0.5 text-rose-400 hover:text-rose-300 hover:underline cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
