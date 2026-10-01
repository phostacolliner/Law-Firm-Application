import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Client, ClientStatus, ClientType } from '../../types';
import { 
  Users, 
  Search, 
  Plus, 
  Building2, 
  User, 
  ShieldCheck, 
  Phone, 
  Mail, 
  MapPin, 
  Briefcase, 
  ExternalLink,
  ShieldAlert,
  Edit2,
  FileCheck2,
  CheckCircle,
  Clock,
  X
} from 'lucide-react';
import { DropdownDatePicker } from '../common/DropdownDatePicker';
import { SectorExportButton } from '../reports/SectorExportButton';

interface ClientManagerProps {
  onOpenNewClient: () => void;
}

export const ClientManager: React.FC<ClientManagerProps> = ({ onOpenNewClient }) => {
  const { 
    clients, 
    matters, 
    invoices, 
    updateClient, 
    setSelectedMatterId, 
    setActiveTab, 
    runConflictCheck,
    formatKSh 
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(clients[0] || null);
  const [conflictResult, setConflictResult] = useState<any>(null);

  // Filter clients
  const filteredClients = clients.filter(c => {
    const matchesSearch = 
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.clientNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.kraPin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.contactPerson && c.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    const matchesType = typeFilter === 'all' || c.type === typeFilter;
    const matchesDate = !dateFilter || c.createdDate >= dateFilter;
    return matchesSearch && matchesStatus && matchesType && matchesDate;
  });

  const clientMatters = selectedClient 
    ? matters.filter(m => m.clientId === selectedClient.id) 
    : [];

  const clientInvoices = selectedClient
    ? invoices.filter(i => i.clientId === selectedClient.id)
    : [];

  const handleRunConflict = (client: Client) => {
    const res = runConflictCheck(client.name);
    setConflictResult(res);
  };

  const togglePortalAccess = (client: Client) => {
    updateClient({
      ...client,
      portalAccess: !client.portalAccess
    });
    if (selectedClient && selectedClient.id === client.id) {
      setSelectedClient({
        ...selectedClient,
        portalAccess: !selectedClient.portalAccess
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Title & Quick Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Users className="w-5 h-5 text-amber-400" />
            Client Management & CRM
          </h1>
          <p className="text-xs text-slate-400">
            Central client database, statutory KRA PIN registration, conflict checks & portal access
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <SectorExportButton
            sectorKey="clients"
            reportTitle="Client CRM Master Register & KYC Index"
            reportSubtitle="Official directory of corporate, individual, and institutional clients, tax PINs, and KYC status"
            sectorName="Client CRM & Compliance"
            statutoryReference="Proceeds of Crime & Anti-Money Laundering Act"
            filenamePrefix="LexisFirm_Clients_Register"
            headers={['Client No', 'Name', 'Type', 'ID / Reg No', 'KRA PIN', 'Email', 'Phone', 'Onboarding Date', 'Status', 'Matters Count', 'Balance (KES)']}
            rows={filteredClients.map(c => [
              c.clientNumber,
              c.name,
              c.type.toUpperCase(),
              c.idOrRegNumber,
              c.kraPin,
              c.email,
              c.phone,
              c.createdDate,
              c.status.toUpperCase(),
              c.matterCount,
              c.outstandingBalance.toLocaleString()
            ])}
            summaryStats={[
              { label: 'Registered Clients', value: filteredClients.length, highlight: true },
              { label: 'Corporate Entities', value: filteredClients.filter(c => c.type === 'company').length },
              { label: 'Active Clients', value: filteredClients.filter(c => c.status === 'active').length },
              { label: 'Total Matters', value: filteredClients.reduce((acc, c) => acc + c.matterCount, 0) }
            ]}
          />

          <button
            onClick={onOpenNewClient}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Register New Client</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row gap-3 items-center justify-between shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by client name, client #, KRA PIN, contact person..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-amber-500 transition-colors"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Intake Date Filter with Dropdown Calendar */}
          <div className="w-40">
            <DropdownDatePicker
              value={dateFilter}
              onChange={(d) => setDateFilter(d)}
              placeholder="Intake Date..."
              showPresets={true}
            />
          </div>
          {dateFilter && (
            <button
              onClick={() => setDateFilter('')}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-xs cursor-pointer"
              title="Clear date filter"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-amber-500 cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="prospective">Prospective</option>
            <option value="inactive">Inactive</option>
            <option value="closed">Closed</option>
          </select>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-amber-500 cursor-pointer"
          >
            <option value="all">All Types</option>
            <option value="company">Corporate / Company</option>
            <option value="individual">Individual</option>
            <option value="institution">Institution / Parastatal</option>
          </select>
        </div>
      </div>

      {/* Main Two-Column Layout: Clients List & Detailed Client Profile */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Clients List (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm flex flex-col max-h-[720px]">
          <div className="p-3 bg-slate-850 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold uppercase tracking-wider text-[11px]">Clients Directory</span>
            <span>{filteredClients.length} registered</span>
          </div>

          <div className="overflow-y-auto divide-y divide-slate-800/80 flex-1">
            {filteredClients.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                No clients match your filter criteria.
              </div>
            ) : (
              filteredClients.map(client => {
                const isSelected = selectedClient?.id === client.id;
                return (
                  <div
                    key={client.id}
                    onClick={() => {
                      setSelectedClient(client);
                      setConflictResult(null);
                    }}
                    className={`p-3.5 transition-all cursor-pointer flex items-start justify-between gap-3 ${
                      isSelected ? 'bg-amber-500/10 border-l-4 border-amber-400' : 'hover:bg-slate-800/50'
                    }`}
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                        client.type === 'company' 
                          ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' 
                          : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      }`}>
                        {client.type === 'company' ? <Building2 className="w-4 h-4" /> : <User className="w-4 h-4" />}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-bold text-white truncate">{client.name}</p>
                          <span className={`text-[9px] uppercase font-bold px-1.5 py-0.2 rounded border ${
                            client.status === 'active' 
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                              : client.status === 'prospective'
                              ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                              : 'bg-slate-700 text-slate-400 border-slate-600'
                          }`}>
                            {client.status}
                          </span>
                        </div>

                        <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                          {client.clientNumber} • {client.kraPin}
                        </p>
                        
                        {client.contactPerson && (
                          <p className="text-[11px] text-slate-300 mt-1 truncate">
                            Contact: {client.contactPerson}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-amber-400 font-semibold border border-slate-700 block">
                        {client.matterCount} {client.matterCount === 1 ? 'Matter' : 'Matters'}
                      </span>
                      {client.outstandingBalance > 0 && (
                        <span className="text-[10px] text-rose-400 font-mono font-medium block mt-1">
                          Bal: {formatKSh(client.outstandingBalance)}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right: Selected Client Profile & Matters Dossier (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {selectedClient ? (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-5">
              {/* Header profile info */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-slate-800">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-800 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                    {selectedClient.type === 'company' ? <Building2 className="w-6 h-6" /> : <User className="w-6 h-6" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-base font-bold text-white">{selectedClient.name}</h2>
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        {selectedClient.type}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">
                      Client ID: {selectedClient.clientNumber} • Since {selectedClient.createdDate}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                  <button
                    onClick={() => handleRunConflict(selectedClient)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 transition-colors cursor-pointer"
                    title="Scan client against firm opposing party records"
                  >
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>Run Conflict Check</span>
                  </button>

                  <button
                    onClick={() => togglePortalAccess(selectedClient)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
                      selectedClient.portalAccess
                        ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/20'
                        : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                    }`}
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Portal: {selectedClient.portalAccess ? 'Enabled' : 'Disabled'}</span>
                  </button>
                </div>
              </div>

              {/* Conflict check result banner if triggered */}
              {conflictResult && (
                <div className={`p-4 rounded-xl border text-xs ${
                  conflictResult.hasConflict 
                    ? 'bg-rose-950/40 border-rose-500/50 text-rose-200' 
                    : 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="font-bold flex items-center gap-2 text-sm">
                      {conflictResult.hasConflict ? (
                        <>
                          <ShieldAlert className="w-4 h-4 text-rose-400" />
                          Potential Conflict Flagged ({conflictResult.matches.length} Matches Found)
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="w-4 h-4 text-emerald-400" />
                          Clear: No Adverse Conflicts Detected
                        </>
                      )}
                    </span>
                    <button 
                      onClick={() => setConflictResult(null)}
                      className="text-slate-400 hover:text-white"
                    >
                      ✕
                    </button>
                  </div>
                  {conflictResult.matches.length > 0 && (
                    <div className="mt-2 space-y-1.5 pl-6">
                      {conflictResult.matches.map((m: any, idx: number) => (
                        <div key={idx} className="text-[11px] bg-slate-900/60 p-2 rounded border border-rose-500/20">
                          <strong>{m.name}</strong> — {m.details}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Particulars Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-800 flex items-start gap-2.5">
                  <FileCheck2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Statutory Registration / ID</span>
                    <span className="text-white font-mono">{selectedClient.idOrRegNumber}</span>
                  </div>
                </div>

                <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-800 flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">KRA Tax PIN</span>
                    <span className="text-white font-mono">{selectedClient.kraPin}</span>
                  </div>
                </div>

                <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-800 flex items-start gap-2.5">
                  <Mail className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <div className="truncate">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Official Email</span>
                    <span className="text-white truncate block">{selectedClient.email}</span>
                  </div>
                </div>

                <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-800 flex items-start gap-2.5">
                  <Phone className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Phone Number</span>
                    <span className="text-white font-mono">{selectedClient.phone}</span>
                  </div>
                </div>

                <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-800 sm:col-span-2 flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Physical & Postal Address</span>
                    <span className="text-white">{selectedClient.address}</span>
                  </div>
                </div>
              </div>

              {/* Client Matters Dossier */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-amber-400" />
                    Active Matters for this Client ({clientMatters.length})
                  </h3>
                </div>

                {clientMatters.length === 0 ? (
                  <div className="p-4 rounded-lg bg-slate-800/30 text-center text-xs text-slate-400 border border-slate-800">
                    No active matters opened for this client yet.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {clientMatters.map(m => (
                      <div
                        key={m.id}
                        onClick={() => {
                          setSelectedMatterId(m.id);
                          setActiveTab('matters');
                        }}
                        className="p-3 rounded-lg bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 transition-all cursor-pointer flex items-center justify-between gap-3 group"
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors truncate">
                              {m.title}
                            </span>
                            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-700 text-slate-300">
                              {m.matterNumber}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5 truncate">
                            {m.court} • {m.caseNumber}
                          </p>
                          <p className="text-[10px] text-amber-400 mt-1">
                            Next Action: {m.nextAction} (Due: {m.nextDeadline})
                          </p>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="text-[11px] font-semibold text-emerald-400 block font-mono">
                            {formatKSh(m.estimatedValue)}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400 uppercase">
                            {m.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Financial Snapshot */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span>Total Invoices Issued: <strong className="text-white font-mono">{clientInvoices.length}</strong></span>
                <span>Outstanding Balance: <strong className="text-rose-400 font-mono">{formatKSh(selectedClient.outstandingBalance)}</strong></span>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-slate-400 bg-slate-900 border border-slate-800 rounded-xl">
              Select a client from the directory to review dossier.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
