import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Calendar,
  FolderOpen,
  CheckSquare,
  GitBranch,
  Receipt,
  Landmark,
  BarChart3,
  Timer,
  Sparkles,
  ShieldAlert,
  History,
  ExternalLink,
  ChevronRight,
  Server
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, currentRole, currentUser } = useApp();

  // If currently in client portal mode, show specialized client navigation
  if (currentRole === 'client') {
    return (
      <aside className="w-64 bg-slate-950 border-r border-slate-800 text-slate-300 flex flex-col shrink-0 min-h-screen">
        <div className="p-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center font-bold text-white text-xs">
              CL
            </div>
            <div>
              <p className="text-xs font-bold text-white uppercase tracking-wider">ABC Limited</p>
              <p className="text-[11px] text-emerald-400 font-medium">Verified Client Portal</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          <button
            onClick={() => setActiveTab('client-portal')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'client-portal'
                ? 'bg-amber-500/15 text-amber-300 font-semibold border border-amber-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>My Matters & Court Dates</span>
          </button>
        </nav>

        {/* Client User Info */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-900/50">
          <div className="flex items-center gap-3">
            <img src={currentUser.avatar} alt={currentUser.name} className="w-9 h-9 rounded-full object-cover border border-slate-700" />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-white truncate">{currentUser.name}</p>
              <p className="text-[10px] text-slate-400 truncate">{currentUser.title}</p>
            </div>
          </div>
        </div>
      </aside>
    );
  }

  const navSections = [
    {
      group: 'Practice Management',
      items: [
        { id: 'dashboard', label: 'Firm Dashboard & BI', icon: LayoutDashboard, badge: null },
        { id: 'clients', label: 'Client CRM & Intake', icon: Users, badge: null },
        { id: 'matters', label: 'Matters & Cases', icon: Briefcase, badge: '6' },
        { id: 'diary', label: 'Court Diary & Calendar', icon: Calendar, badge: 'Urgent' },
        { id: 'documents', label: 'Digital Document Archive', icon: FolderOpen, badge: null },
        { id: 'tasks', label: 'Task Management', icon: CheckSquare, badge: null },
        { id: 'workflows', label: 'Conveyancing Workflows', icon: GitBranch, badge: '10 Stages' }
      ]
    },
    {
      group: 'Finance & Accounts',
      items: [
        { id: 'billing', label: 'Billing & Invoicing', icon: Receipt, badge: null },
        { id: 'trust', label: 'Client Trust Accounting', icon: Landmark, badge: 'Statutory' },
        { id: 'firm-accounting', label: 'Firm Operating P&L', icon: BarChart3, badge: null },
        { id: 'time-tracker', label: 'Time Tracking & Rates', icon: Timer, badge: null }
      ]
    },
    {
      group: 'Legal Intelligence & Security',
      items: [
        { id: 'ai-assistant', label: 'AI Legal Drafter & Research', icon: Sparkles, badge: 'Gemini 3.8' },
        { id: 'conflicts', label: 'Conflict of Interest Check', icon: ShieldAlert, badge: null },
        { id: 'audit-trail', label: 'Audit Trail & Compliance', icon: History, badge: null }
      ]
    },
    {
      group: 'System & Governance',
      items: [
        { id: 'deployment', label: 'Deployment & Reset System', icon: Server, badge: 'DevOps' },
        { id: 'client-portal', label: 'Client Portal Preview', icon: ExternalLink, badge: 'Preview' }
      ]
    }
  ];

  return (
    <aside className="w-64 bg-slate-950 border-r border-slate-800 text-slate-300 flex flex-col shrink-0 min-h-screen">
      {/* Scrollable Navigation */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {navSections.map(section => (
          <div key={section.group}>
            <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {section.group}
            </p>
            <div className="space-y-1">
              {section.items.map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all group cursor-pointer ${
                      isActive
                        ? 'bg-amber-500/15 text-amber-300 font-semibold border border-amber-500/30 shadow-sm'
                        : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-amber-400' : 'text-slate-400 group-hover:text-slate-300'}`} />
                      <span>{item.label}</span>
                    </div>

                    {item.badge && (
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${
                        item.badge === 'Urgent' 
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30 animate-pulse'
                          : item.badge === 'Statutory'
                          ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                          : item.badge === 'Gemini 3.8'
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                          : 'bg-slate-800 text-slate-400'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* User Status Bar at bottom */}
      <div className="p-3 border-t border-slate-800/90 bg-slate-900/60">
        <div className="flex items-center gap-2.5">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-9 h-9 rounded-lg object-cover border border-amber-500/30 shrink-0"
          />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-white truncate">{currentUser.name}</p>
            <p className="text-[10px] text-amber-400 truncate font-mono">
              {currentUser.barNumber ? `Bar: ${currentUser.barNumber}` : currentUser.title}
            </p>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </div>
      </div>
    </aside>
  );
};
