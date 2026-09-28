import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { History, Search, ShieldCheck, Clock, User, Filter, FileText, X } from 'lucide-react';
import { DropdownDatePicker } from '../common/DropdownDatePicker';

export const AuditTrailViewer: React.FC = () => {
  const { auditLogs } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState('');

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = 
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.targetType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.targetId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDate = !filterDate || log.timestamp.startsWith(filterDate);
    return matchesSearch && matchesDate;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div>
        <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <History className="w-5 h-5 text-amber-400" />
          Audit Trail & Regulatory Compliance Register
        </h1>
        <p className="text-xs text-slate-400">
          Immutable event log of user actions, file accesses, trust ledger verifications, and financial modifications
        </p>
      </div>

      {/* Search & Date Filter Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search audit trail by user, action, matter ref..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
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

      {/* Audit Log Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 bg-slate-850 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span className="font-semibold uppercase tracking-wider text-[11px]">System Activity Ledger</span>
          <span>{filteredLogs.length} events logged</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[10px] font-mono uppercase bg-slate-950/40">
                <th className="p-3">Timestamp</th>
                <th className="p-3">User & Role</th>
                <th className="p-3">Action Type</th>
                <th className="p-3">Target Scope</th>
                <th className="p-3">Target Ref</th>
                <th className="p-3">Audit Particulars</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filteredLogs.map(log => (
                <tr key={log.id} className="hover:bg-slate-800/40">
                  <td className="p-3 text-slate-400 whitespace-nowrap">{log.timestamp}</td>
                  <td className="p-3 font-sans whitespace-nowrap">
                    <span className="font-semibold text-white block">{log.userName}</span>
                    <span className="text-[10px] text-slate-400">{log.userRole}</span>
                  </td>
                  <td className="p-3">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-amber-300 font-bold border border-slate-700">
                      {log.action}
                    </span>
                  </td>
                  <td className="p-3 font-sans text-slate-300">{log.targetType}</td>
                  <td className="p-3 text-amber-400 font-bold">{log.targetId}</td>
                  <td className="p-3 font-sans text-slate-300 max-w-md">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
