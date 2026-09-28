import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ShieldAlert, 
  Search, 
  CheckCircle2, 
  AlertTriangle, 
  Building, 
  User, 
  Briefcase, 
  Scale,
  FileCheck2
} from 'lucide-react';

export const ConflictChecker: React.FC = () => {
  const { runConflictCheck, matters, clients, setSelectedMatterId, setActiveTab } = useApp();

  const [query, setQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    const res = runConflictCheck(query);
    setResult(res);
    setHasSearched(true);
  };

  const sampleNames = [
    'XYZ Logistics Limited',
    'Prime Properties Holdings Ltd',
    'St. Jude Hospital',
    'Wilson Gichuru',
    'Apex Milling',
    'Kenya Railways Corporation'
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div>
        <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-amber-400" />
          Conflict of Interest Check Engine
        </h1>
        <p className="text-xs text-slate-400">
          Statutory compliance check under Advocates Act (Cap 16) — scans adverse parties, co-litigants, and existing clients
        </p>
      </div>

      {/* Search Input Box */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm space-y-4 max-w-3xl">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Enter individual name, company name, director, or institution to check..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-3 text-sm bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-amber-500"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
          >
            Run Conflict Scan
          </button>
        </form>

        {/* Quick sample chips */}
        <div className="flex items-center gap-2 flex-wrap text-xs text-slate-400">
          <span>Quick test queries:</span>
          {sampleNames.map(name => (
            <button
              key={name}
              onClick={() => {
                setQuery(name);
                const res = runConflictCheck(name);
                setResult(res);
                setHasSearched(true);
              }}
              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 cursor-pointer"
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      {/* Results Display */}
      {hasSearched && (
        <div className="max-w-3xl space-y-4">
          {result?.hasConflict ? (
            <div className="p-6 rounded-2xl bg-rose-950/30 border-2 border-rose-500/50 shadow-xl space-y-4">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/40 shrink-0">
                  <AlertTriangle className="w-7 h-7 animate-pulse" />
                </div>
                <div>
                  <span className="text-xs font-black uppercase tracking-wider px-2 py-0.5 rounded bg-rose-600 text-white font-mono">
                    Potential Conflict of Interest Flagged
                  </span>
                  <h3 className="text-lg font-bold text-white mt-1">
                    "{query}" appears in firm matter records!
                  </h3>
                  <p className="text-xs text-rose-200 mt-0.5 leading-relaxed">
                    Advocate ethical rules prevent acting against existing clients or adverse parties without formal waiver and ethical wall approval.
                  </p>
                </div>
              </div>

              {/* Matches List */}
              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-300 block">
                  Identified Conflicting Records ({result.matches.length}):
                </span>
                {result.matches.map((m: any, idx: number) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-900 border border-rose-500/30 flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <span className="font-bold text-white text-sm block">{m.name}</span>
                      <span className="text-slate-300 mt-0.5 block">{m.details}</span>
                    </div>

                    {m.matterNumber && (
                      <button
                        onClick={() => {
                          const matter = matters.find(item => item.matterNumber === m.matterNumber);
                          if (matter) {
                            setSelectedMatterId(matter.id);
                            setActiveTab('matters');
                          }
                        }}
                        className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs transition-colors shrink-0 cursor-pointer"
                      >
                        Inspect Matter Dossier →
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-2xl bg-emerald-950/30 border-2 border-emerald-500/40 shadow-xl space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    Clear: No Adverse Conflicts Detected for "{query}"
                  </h3>
                  <p className="text-xs text-emerald-300">
                    The name does not match any current active clients, opposing parties, or represented co-litigants. Safe to proceed with client intake.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 font-mono">
                Verification Timestamp: {new Date().toLocaleString('en-GB')} • Logged in firm compliance audit log.
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
