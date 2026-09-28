import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { 
  Scale, 
  Search, 
  Bell, 
  Plus, 
  UserCheck, 
  ShieldAlert, 
  Calendar, 
  Clock, 
  FileText, 
  CheckCircle2, 
  AlertTriangle,
  RotateCcw,
  Server
} from 'lucide-react';

interface HeaderProps {
  onOpenNewMatter: () => void;
  onOpenNewClient: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenNewMatter, onOpenNewClient }) => {
  const { 
    currentUser, 
    currentRole, 
    switchRole, 
    notifications, 
    setIsGlobalSearchOpen,
    setActiveTab,
    firmProfile
  } = useApp();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const roleRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
      }
      if (roleRef.current && !roleRef.current.contains(e.target as Node)) {
        setIsRoleMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const rolesList: { role: UserRole; label: string; desc: string }[] = [
    { role: 'managing_partner', label: 'Managing Partner', desc: 'Full practice control, analytics, financial reports & audit' },
    { role: 'partner', label: 'Litigation Partner', desc: 'Case oversight, legal approvals, billing & documents' },
    { role: 'associate', label: 'Associate Advocate', desc: 'Pleadings drafting, court diary, research & time logging' },
    { role: 'clerk', label: 'Court Clerk', desc: 'Judiciary e-filing, summons service, diary & records' },
    { role: 'accounts', label: 'Accounts / Trust Auditor', desc: 'Trust accounts, fee notes, receipts & firm ledger' },
    { role: 'client', label: 'Client Portal (ABC Ltd)', desc: 'Restricted view: matter status, hearings & fee notes' }
  ];

  const unreadCount = notifications.length;

  return (
    <header className="sticky top-0 z-30 bg-slate-900 border-b border-slate-800 text-white px-4 lg:px-6 py-3 shadow-md">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Branding & Tagline */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-900/30 text-slate-950 font-bold">
            <Scale className="w-6 h-6 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif text-lg font-bold tracking-tight text-white">
                LEXIS<span className="text-amber-400">FIRM</span>
              </span>
              <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30">
                LFMS v4.2
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">Advocates & Legal Business Intelligence OS</p>
          </div>
        </div>

        {/* Center: Global Search Bar */}
        <div className="flex-1 max-w-md hidden md:block">
          <button
            onClick={() => setIsGlobalSearchOpen(true)}
            className="w-full flex items-center justify-between px-3.5 py-2 text-sm text-slate-400 bg-slate-800/80 border border-slate-700/80 rounded-lg hover:border-amber-500/50 hover:bg-slate-800 transition-all shadow-inner"
          >
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-slate-400" />
              <span>Search matters, clients, court dates, documents...</span>
            </div>
            <kbd className="px-2 py-0.5 text-[11px] font-mono bg-slate-900 border border-slate-700 rounded text-slate-300">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Add Buttons (Hidden in Client Portal) */}
          {currentRole !== 'client' && (
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenNewMatter}
                className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors shadow-sm cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Matter</span>
              </button>
              <button
                onClick={onOpenNewClient}
                className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer"
              >
                <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                <span>New Client</span>
              </button>
            </div>
          )}

          {/* Role Switcher Pill */}
          <div className="relative" ref={roleRef}>
            <button
              onClick={() => setIsRoleMenuOpen(!isRoleMenuOpen)}
              className="flex items-center gap-2 px-3 py-1.5 text-xs rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 transition-colors cursor-pointer"
              title="Switch user perspective to test RBAC access rules"
            >
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="hidden sm:inline text-slate-400">Role:</span>
              <span className="font-semibold text-amber-300">
                {currentRole === 'managing_partner' ? 'Managing Partner' :
                 currentRole === 'partner' ? 'Partner' :
                 currentRole === 'associate' ? 'Associate' :
                 currentRole === 'clerk' ? 'Court Clerk' :
                 currentRole === 'accounts' ? 'Accounts' : 'Client Portal'}
              </span>
            </button>

            {isRoleMenuOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-3 py-2 border-b border-slate-800">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Role-Based Access Control</p>
                  <p className="text-[11px] text-slate-500">Switch persona to test permissions & views</p>
                </div>
                <div className="py-1">
                  {rolesList.map(item => (
                    <button
                      key={item.role}
                      onClick={() => {
                        switchRole(item.role);
                        setIsRoleMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 hover:bg-slate-800/80 transition-colors flex flex-col gap-0.5 ${
                        currentRole === item.role ? 'bg-amber-500/10 border-l-2 border-amber-400' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-semibold ${currentRole === item.role ? 'text-amber-300' : 'text-slate-200'}`}>
                          {item.label}
                        </span>
                        {currentRole === item.role && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                        )}
                      </div>
                      <span className="text-[11px] text-slate-400 leading-tight">{item.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Notifications Dropdown */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="relative p-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Central Court & Task Alerts"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-500 text-[10px] font-bold text-white flex items-center justify-center animate-pulse shadow-md">
                  {unreadCount}
                </span>
              )}
            </button>

            {isNotifOpen && (
              <div className="absolute right-0 mt-2 w-84 sm:w-96 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl py-2 z-50 max-h-[80vh] overflow-y-auto">
                <div className="px-4 py-2 border-b border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
                      Central Diary & Task Alerts
                    </span>
                  </div>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-amber-400 font-semibold border border-slate-700">
                    {unreadCount} Active
                  </span>
                </div>

                <div className="divide-y divide-slate-800/80">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-xs text-slate-400">
                      No active alerts. All matters and deadlines compliant!
                    </div>
                  ) : (
                    notifications.map(n => (
                      <div
                        key={n.id}
                        onClick={() => {
                          if (n.linkTab) setActiveTab(n.linkTab);
                          setIsNotifOpen(false);
                        }}
                        className={`p-3.5 hover:bg-slate-800/70 transition-colors cursor-pointer flex items-start gap-3 ${
                          n.type === 'urgent' ? 'bg-rose-950/20' : 'bg-slate-900'
                        }`}
                      >
                        <div className="mt-0.5">
                          {n.type === 'urgent' ? (
                            <div className="p-1 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30">
                              <AlertTriangle className="w-3.5 h-3.5" />
                            </div>
                          ) : (
                            <div className="p-1 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                              <Clock className="w-3.5 h-3.5" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-white leading-snug">{n.title}</p>
                          <p className="text-[11px] text-slate-300 truncate mt-0.5">{n.message}</p>
                          <p className="text-[10px] text-slate-400 font-medium mt-1">{n.timestamp}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="px-3 pt-2 pb-1 border-t border-slate-800 text-center">
                  <button
                    onClick={() => {
                      setActiveTab('diary');
                      setIsNotifOpen(false);
                    }}
                    className="text-xs text-amber-400 hover:text-amber-300 font-medium"
                  >
                    Open Central Court Diary & Calendar →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Deployment & Reset System Quick Access */}
          <button
            onClick={() => setActiveTab('deployment')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
              firmProfile.environment === 'production'
                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/25'
                : firmProfile.environment === 'staging'
                ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 hover:bg-amber-500/25'
                : 'bg-purple-500/15 border-purple-500/40 text-purple-300 hover:bg-purple-500/25'
            }`}
            title="Open Deployment, Reset & Disaster Recovery Console"
          >
            <Server className="w-3.5 h-3.5" />
            <span className="hidden sm:inline uppercase text-[10px] tracking-wider font-bold">
              {firmProfile.environment}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
