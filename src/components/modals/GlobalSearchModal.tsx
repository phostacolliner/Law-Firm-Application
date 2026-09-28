import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Search, 
  Briefcase, 
  Users, 
  Calendar, 
  FolderOpen, 
  Receipt, 
  ArrowRight,
  X
} from 'lucide-react';

export const GlobalSearchModal: React.FC = () => {
  const { 
    isGlobalSearchOpen, 
    setIsGlobalSearchOpen, 
    matters, 
    clients, 
    courtEvents, 
    documents, 
    invoices, 
    setSelectedMatterId, 
    setSelectedClientId, 
    setActiveTab,
    formatKSh 
  } = useApp();

  const [query, setQuery] = useState('');

  // Keyboard shortcut listener for Cmd+K / Ctrl+K & Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsGlobalSearchOpen(!isGlobalSearchOpen);
      }
      if (e.key === 'Escape' && isGlobalSearchOpen) {
        setIsGlobalSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isGlobalSearchOpen, setIsGlobalSearchOpen]);

  if (!isGlobalSearchOpen) return null;

  const q = query.toLowerCase().trim();

  const matchedMatters = q ? matters.filter(m => 
    m.title.toLowerCase().includes(q) || 
    m.matterNumber.toLowerCase().includes(q) || 
    m.caseNumber.toLowerCase().includes(q) ||
    m.opposingParty.toLowerCase().includes(q)
  ) : [];

  const matchedClients = q ? clients.filter(c => 
    c.name.toLowerCase().includes(q) || 
    c.clientNumber.toLowerCase().includes(q) || 
    c.kraPin.toLowerCase().includes(q)
  ) : [];

  const matchedEvents = q ? courtEvents.filter(e => 
    e.matterTitle.toLowerCase().includes(q) || 
    e.court.toLowerCase().includes(q) ||
    e.eventType.toLowerCase().includes(q)
  ) : [];

  const matchedDocs = q ? documents.filter(d => 
    d.title.toLowerCase().includes(q) || 
    d.fileName.toLowerCase().includes(q) ||
    d.category.toLowerCase().includes(q)
  ) : [];

  const totalResults = matchedMatters.length + matchedClients.length + matchedEvents.length + matchedDocs.length;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-start justify-center pt-16 px-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[80vh] animate-in fade-in zoom-in-95 duration-100">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-amber-400 shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Type matter #, client name, court date, pleading, or KRA PIN..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-white placeholder-slate-400 focus:outline-none"
          />
          <button
            onClick={() => setIsGlobalSearchOpen(false)}
            className="p-1 rounded-md text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results Area */}
        <div className="overflow-y-auto p-4 space-y-4 flex-1">
          {!query ? (
            <div className="p-8 text-center text-xs text-slate-400 space-y-2">
              <p className="font-semibold text-slate-300">Global Advocate Search</p>
              <p>Type to search across matters, clients, court dates, pleadings, and fee notes.</p>
              <div className="flex justify-center gap-2 pt-2 text-[11px]">
                <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">ABC Limited</span>
                <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">ELRC</span>
                <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">Conveyancing</span>
              </div>
            </div>
          ) : totalResults === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              No records found for "{query}".
            </div>
          ) : (
            <div className="space-y-4">
              {/* Matters */}
              {matchedMatters.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5" />
                    Matters & Cases ({matchedMatters.length})
                  </span>
                  {matchedMatters.map(m => (
                    <div
                      key={m.id}
                      onClick={() => {
                        setSelectedMatterId(m.id);
                        setActiveTab('matters');
                        setIsGlobalSearchOpen(false);
                      }}
                      className="p-2.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 transition-colors cursor-pointer flex items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white">{m.title}</span>
                          <span className="font-mono text-[10px] text-amber-300">{m.matterNumber}</span>
                        </div>
                        <p className="text-[11px] text-slate-400">{m.court} • {m.caseNumber}</p>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                  ))}
                </div>
              )}

              {/* Clients */}
              {matchedClients.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" />
                    Clients ({matchedClients.length})
                  </span>
                  {matchedClients.map(c => (
                    <div
                      key={c.id}
                      onClick={() => {
                        setSelectedClientId(c.id);
                        setActiveTab('clients');
                        setIsGlobalSearchOpen(false);
                      }}
                      className="p-2.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 transition-colors cursor-pointer flex items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white">{c.name}</span>
                          <span className="font-mono text-[10px] text-slate-400">{c.clientNumber}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 font-mono">PIN: {c.kraPin} • {c.phone}</p>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                  ))}
                </div>
              )}

              {/* Court Events */}
              {matchedEvents.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    Court Events & Deadlines ({matchedEvents.length})
                  </span>
                  {matchedEvents.map(e => (
                    <div
                      key={e.id}
                      onClick={() => {
                        setSelectedMatterId(e.matterId);
                        setActiveTab('diary');
                        setIsGlobalSearchOpen(false);
                      }}
                      className="p-2.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 transition-colors cursor-pointer flex items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <span className="font-bold text-white">{e.eventType}: {e.matterTitle}</span>
                        <p className="text-[11px] text-amber-300 font-mono">{e.date} at {e.time} • {e.court}</p>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                  ))}
                </div>
              )}

              {/* Documents */}
              {matchedDocs.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
                    <FolderOpen className="w-3.5 h-3.5" />
                    Documents & Pleadings ({matchedDocs.length})
                  </span>
                  {matchedDocs.map(d => (
                    <div
                      key={d.id}
                      onClick={() => {
                        setSelectedMatterId(d.matterId);
                        setActiveTab('documents');
                        setIsGlobalSearchOpen(false);
                      }}
                      className="p-2.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 transition-colors cursor-pointer flex items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <span className="font-bold text-white">{d.title}</span>
                        <p className="text-[11px] text-slate-400 font-mono">{d.fileName} • {d.category}</p>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <span>Press <kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-slate-300">ESC</kbd> to exit</span>
          <span>LexisFirm Instant Knowledge Index</span>
        </div>
      </div>
    </div>
  );
};
