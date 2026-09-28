import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Briefcase, 
  Calendar, 
  CheckSquare, 
  Receipt, 
  TrendingUp, 
  AlertTriangle, 
  Landmark, 
  ArrowUpRight, 
  Clock, 
  Scale, 
  Award,
  ChevronRight,
  ShieldCheck,
  Building,
  UserCheck,
  Server
} from 'lucide-react';

export const FirmDashboard: React.FC = () => {
  const { 
    matters, 
    courtEvents, 
    tasks, 
    invoices, 
    trustTransactions, 
    timeEntries, 
    setActiveTab, 
    setSelectedMatterId,
    formatKSh,
    firmProfile,
    snapshots
  } = useApp();

  // Metrics calculations
  const activeMattersCount = matters.filter(m => m.status !== 'Closed').length;
  const newMattersThisMonth = 4; // simulated recent openings
  const upcomingCourtEvents = courtEvents.filter(e => e.status === 'Upcoming');
  const overdueTasksCount = tasks.filter(t => t.status !== 'Complete' && t.deadline < '2026-09-28').length;
  
  const totalOutstandingFees = invoices.reduce((sum, inv) => sum + inv.balanceDue, 0);
  const totalCollectedRevenue = invoices.reduce((sum, inv) => sum + inv.amountPaid, 0);

  // Trust money held strictly segregated under Advocates Accounts Rules
  const totalTrustBalance = trustTransactions.reduce((acc, curr) => {
    return curr.type === 'deposit_received' ? acc + curr.amount : acc - curr.amount;
  }, 0);

  // Advocate Performance Analytics
  const advocatesStats = [
    { name: 'Phosta Colliner, SC', role: 'Managing Partner', matters: 14, billings: 4200000, collections: 3600000, rate: 85.7 },
    { name: 'Jane Wanjiku Kamau', role: 'Partner (Litigation & Conveyancing)', matters: 11, billings: 3100000, collections: 2850000, rate: 91.9 },
    { name: 'David Kiprop Cheruiyot', role: 'Senior Associate', matters: 9, billings: 1850000, collections: 1450000, rate: 78.4 },
    { name: 'Faith Akinyi Otieno', role: 'Associate Advocate', matters: 7, billings: 1200000, collections: 950000, rate: 79.2 }
  ];

  // Practice Areas Breakdown
  const practiceAreaDistribution = [
    { category: 'Commercial Litigation', count: 8, percentage: 32, revenue: 3800000, color: 'bg-blue-500' },
    { category: 'Conveyancing & Real Estate', count: 6, percentage: 24, revenue: 4200000, color: 'bg-emerald-500' },
    { category: 'Employment & Labour', count: 4, percentage: 16, revenue: 1650000, color: 'bg-amber-500' },
    { category: 'Succession & Family', count: 3, percentage: 12, revenue: 1400000, color: 'bg-purple-500' },
    { category: 'Land & Environment', count: 3, percentage: 12, revenue: 1100000, color: 'bg-teal-500' },
    { category: 'Debt Recovery', count: 2, percentage: 8, revenue: 650000, color: 'bg-rose-500' }
  ];

  // Tomorrow's urgent hearing
  const hearingTomorrow = courtEvents.find(e => e.date === '2026-09-29' && e.eventType === 'Hearing');

  return (
    <div className="space-y-6">
      {/* Top Banner: Urgent Court Alert */}
      {hearingTomorrow && (
        <div className="bg-gradient-to-r from-rose-950/80 via-slate-900 to-slate-900 border border-rose-500/40 rounded-xl p-4 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/30 shrink-0">
              <AlertTriangle className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-rose-500 text-white font-mono">
                  Court Hearing Tomorrow
                </span>
                <span className="text-xs text-rose-300 font-semibold">09:00 AM • Milimani ELRC Courtroom 4</span>
              </div>
              <h2 className="text-base font-bold text-white mt-1">
                {hearingTomorrow.matterTitle} ({hearingTomorrow.matterNumber})
              </h2>
              <p className="text-xs text-slate-300 mt-0.5">
                Before: <strong className="text-white">{hearingTomorrow.judgeName}</strong> • Assigned: <span className="text-amber-300">{hearingTomorrow.advocateAssigned}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 w-full md:w-auto">
            <button
              onClick={() => {
                setSelectedMatterId(hearingTomorrow.matterId);
                setActiveTab('matters');
              }}
              className="flex-1 md:flex-none px-3.5 py-2 text-xs font-semibold rounded-lg bg-rose-600 hover:bg-rose-500 text-white transition-colors cursor-pointer"
            >
              Open Matter File & Trial Bundle
            </button>
            <button
              onClick={() => setActiveTab('diary')}
              className="px-3.5 py-2 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer"
            >
              View Court Diary
            </button>
          </div>
        </div>
      )}

      {/* Main KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active Matters */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 hover:border-slate-700 transition-all shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Active Matters</span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-white font-mono">{activeMattersCount}</span>
            <span className="text-xs font-medium text-emerald-400 flex items-center gap-0.5">
              <TrendingUp className="w-3.5 h-3.5" />
              +{newMattersThisMonth} this mo.
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Across 6 Kenyan superior & sub courts</p>
        </div>

        {/* Court Events This Week */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 hover:border-slate-700 transition-all shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Court Events This Week</span>
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-white font-mono">{upcomingCourtEvents.length}</span>
            <span className="text-xs font-medium text-amber-300">
              1 Hearing, 2 Mentions
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Central Diary with automated reminders</p>
        </div>

        {/* Outstanding Receivables */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 hover:border-slate-700 transition-all shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Outstanding Fees</span>
            <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-xl font-bold text-white font-mono">{formatKSh(totalOutstandingFees)}</span>
            <span className="text-[11px] font-semibold text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/20">
              3 Fee Notes
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Collected YTD: {formatKSh(totalCollectedRevenue)}</p>
        </div>

        {/* Client Trust Money (Strict Segregation) */}
        <div className="bg-slate-900 border border-emerald-500/30 rounded-xl p-4 hover:border-emerald-500/50 transition-all shadow-sm bg-gradient-to-br from-slate-900 to-emerald-950/20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              Trust Account Balance
            </span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Landmark className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-xl font-bold text-emerald-300 font-mono">{formatKSh(totalTrustBalance)}</span>
            <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Statutory
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Advocates Accounts Rules compliant</p>
        </div>
      </div>

      {/* Grid: Practice Area Economics & Realization Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Practice Areas & Revenue Distribution (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">Practice Area Economics & Caseload</h2>
              <p className="text-xs text-slate-400">Distribution of active matters, estimated value & fee contribution</p>
            </div>
            <button
              onClick={() => setActiveTab('firm-accounting')}
              className="text-xs text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1"
            >
              <span>Full P&L</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3 pt-2">
            {practiceAreaDistribution.map(item => (
              <div key={item.category} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                    <span className="font-semibold text-slate-200">{item.category}</span>
                    <span className="text-slate-400">({item.count} matters)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-slate-300">{formatKSh(item.revenue)}</span>
                    <span className="font-mono text-amber-400 font-semibold w-8 text-right">{item.percentage}%</span>
                  </div>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div 
                    className={`h-full ${item.color} rounded-full transition-all duration-500`}
                    style={{ width: `${item.percentage * 2.8}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>Total Practice Pipeline Value: <strong className="text-white font-mono">KSh 161.8M</strong></span>
            <span>Realization Ratio: <strong className="text-emerald-400 font-mono">87.4%</strong></span>
          </div>
        </div>

        {/* Quick Actions & High Stakes Tasks (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                Critical Task Deadlines
              </h2>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-semibold border border-rose-500/30">
                {overdueTasksCount} Overdue
              </span>
            </div>

            <div className="space-y-2.5">
              {tasks.slice(0, 4).map(task => (
                <div 
                  key={task.id}
                  className={`p-3 rounded-lg border text-xs transition-all ${
                    task.priority === 'Urgent'
                      ? 'bg-rose-950/20 border-rose-500/30 text-rose-200'
                      : 'bg-slate-800/60 border-slate-700/60 text-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-semibold text-white leading-snug">{task.title}</span>
                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded uppercase font-bold shrink-0 ${
                      task.priority === 'Urgent' ? 'bg-rose-500 text-white' : 'bg-slate-700 text-slate-300'
                    }`}>
                      {task.priority}
                    </span>
                  </div>
                  <div className="mt-1.5 flex items-center justify-between text-[11px] text-slate-400">
                    <span>{task.assignedToName} ({task.assignedRole})</span>
                    <span className="font-mono text-amber-300">Due: {task.deadline}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setActiveTab('tasks')}
            className="w-full py-2 text-center text-xs font-semibold text-amber-400 hover:text-amber-300 bg-slate-800/80 hover:bg-slate-800 rounded-lg border border-slate-700 transition-colors"
          >
            Open Tasks Kanban Board →
          </button>
        </div>
      </div>

      {/* Advocate Productivity & Collections Analytics Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              Advocate Performance & Collection Matrix
            </h2>
            <p className="text-xs text-slate-400">Billings, realized collections, and recovery efficiency per fee-earner</p>
          </div>
          <button
            onClick={() => setActiveTab('time-tracker')}
            className="text-xs text-amber-400 hover:text-amber-300 font-medium self-start sm:self-auto"
          >
            View Billable Hours Tracker →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] font-mono">
                <th className="pb-3 font-semibold">Advocate / Fee Earner</th>
                <th className="pb-3 font-semibold">Title / Seniority</th>
                <th className="pb-3 font-semibold text-center">Matters</th>
                <th className="pb-3 font-semibold text-right">Total Billings</th>
                <th className="pb-3 font-semibold text-right">Collections</th>
                <th className="pb-3 font-semibold text-right">Recovery Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {advocatesStats.map(adv => (
                <tr key={adv.name} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 font-semibold text-white flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-slate-800 border border-amber-500/30 flex items-center justify-center text-[10px] text-amber-400 font-bold">
                      {adv.name.charAt(0)}
                    </div>
                    <span>{adv.name}</span>
                  </td>
                  <td className="py-3 text-slate-400">{adv.role}</td>
                  <td className="py-3 font-mono text-center text-slate-200">{adv.matters}</td>
                  <td className="py-3 font-mono text-right text-slate-200">{formatKSh(adv.billings)}</td>
                  <td className="py-3 font-mono text-right text-emerald-400 font-semibold">{formatKSh(adv.collections)}</td>
                  <td className="py-3 text-right">
                    <span className="font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
                      {adv.rate}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Courts & Jurisdictions Activity Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Primary Commercial Court</p>
              <p className="text-sm font-bold text-white">Milimani Commercial Courts</p>
              <p className="text-[11px] text-amber-400 font-mono mt-0.5">3 Active Causes (Debt & Tort)</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Labour & Employment</p>
              <p className="text-sm font-bold text-white">ELRC Nairobi</p>
              <p className="text-[11px] text-emerald-400 font-mono mt-0.5">Hearing Tomorrow (Cause 89/26)</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Conveyancing & Lands</p>
              <p className="text-sm font-bold text-white">ArdhiSasisha & Lands Registry</p>
              <p className="text-[11px] text-teal-300 font-mono mt-0.5">L.R. 209/14250/8 Valuation Phase</p>
            </div>
          </div>
        </div>
      </div>

      {/* Practice Deployment & Reset Operations Quick Deck */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <Server className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white">{firmProfile.firmName}</span>
              <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider ${
                firmProfile.environment === 'production'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
              }`}>
                {firmProfile.environment}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              LSK Registration: <span className="font-mono text-slate-300">{firmProfile.lskFirmNumber}</span> • {snapshots.length} System Snapshots Recorded
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveTab('deployment')}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-bold border border-slate-700 hover:border-amber-500/30 transition-all cursor-pointer self-start sm:self-center"
        >
          <Server className="w-3.5 h-3.5" />
          <span>Manage Deployment & Reset System →</span>
        </button>
      </div>
    </div>
  );
};
