import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserProfile,
  UserRole,
  Client,
  Matter,
  CourtEvent,
  LegalDocument,
  Task,
  Invoice,
  PaymentReceipt,
  TrustTransaction,
  OfficeExpense,
  TimeEntry,
  CommunicationLog,
  AuditLog,
  WorkflowStage,
  NotificationItem,
  FirmDeploymentProfile,
  SystemSnapshot,
  SystemIntegrityReport,
  ResetScope
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_CLIENTS,
  INITIAL_MATTERS,
  INITIAL_COURT_EVENTS,
  INITIAL_DOCUMENTS,
  INITIAL_TASKS,
  INITIAL_INVOICES,
  INITIAL_RECEIPTS,
  INITIAL_TRUST_TRANSACTIONS,
  INITIAL_OFFICE_EXPENSES,
  INITIAL_TIME_ENTRIES,
  INITIAL_COMMUNICATIONS,
  INITIAL_CONVEYANCING_WORKFLOW,
  INITIAL_AUDIT_LOGS
} from '../data/mockData';
import {
  DEFAULT_FIRM_PROFILE,
  DEPLOYMENT_TEMPLATES
} from '../data/deploymentPresets';

interface ConflictResult {
  hasConflict: boolean;
  score: number;
  matches: Array<{
    type: 'Client' | 'Matter Opposing Party' | 'Matter Co-Party';
    name: string;
    details: string;
    matterNumber?: string;
  }>;
}

interface AppContextType {
  currentUser: UserProfile;
  currentRole: UserRole;
  switchRole: (role: UserRole) => void;
  clients: Client[];
  matters: Matter[];
  courtEvents: CourtEvent[];
  documents: LegalDocument[];
  tasks: Task[];
  invoices: Invoice[];
  receipts: PaymentReceipt[];
  trustTransactions: TrustTransaction[];
  officeExpenses: OfficeExpense[];
  timeEntries: TimeEntry[];
  communications: CommunicationLog[];
  auditLogs: AuditLog[];
  conveyancingWorkflow: WorkflowStage[];
  notifications: NotificationItem[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedMatterId: string | null;
  setSelectedMatterId: (id: string | null) => void;
  selectedClientId: string | null;
  setSelectedClientId: (id: string | null) => void;
  isGlobalSearchOpen: boolean;
  setIsGlobalSearchOpen: (open: boolean) => void;

  // Deployment & Reset Engine
  firmProfile: FirmDeploymentProfile;
  updateFirmProfile: (profile: Partial<FirmDeploymentProfile>) => void;
  snapshots: SystemSnapshot[];
  createSnapshot: (name: string, description?: string, autoCreated?: boolean) => SystemSnapshot;
  restoreSnapshot: (snapshotId: string) => boolean;
  deleteSnapshot: (snapshotId: string) => void;
  deployPreset: (presetId: string) => boolean;
  executeSelectiveReset: (scope: ResetScope, options?: { confirmPhrase?: string; memo?: string }) => boolean;
  runIntegrityDiagnostics: () => SystemIntegrityReport;
  exportDatabaseJson: () => string;
  importDatabaseJson: (jsonString: string) => { success: boolean; message: string; recordCounts?: Record<string, number> };
  
  // Actions
  addClient: (client: Omit<Client, 'id' | 'clientNumber' | 'matterCount' | 'outstandingBalance' | 'createdDate'> & { createdDate?: string }) => Client;
  updateClient: (client: Client) => void;
  addMatter: (matter: Omit<Matter, 'id' | 'matterNumber' | 'dateOpened'>) => Matter;
  updateMatter: (matter: Matter) => void;
  addCourtEvent: (event: Omit<CourtEvent, 'id'>) => CourtEvent;
  addDocument: (doc: Omit<LegalDocument, 'id' | 'uploadedAt' | 'version'> & { uploadedAt?: string; uploadedDate?: string }) => LegalDocument;
  addTask: (task: Omit<Task, 'id'>) => Task;
  updateTaskStatus: (taskId: string, status: Task['status']) => void;
  addInvoice: (invoice: Omit<Invoice, 'id' | 'invoiceNumber'>) => Invoice;
  recordPayment: (receiptData: {
    invoiceId: string;
    amount: number;
    paymentMethod: PaymentReceipt['paymentMethod'];
    referenceNumber: string;
    accountType: 'office' | 'trust';
  }) => void;
  addTrustTransaction: (tx: Omit<TrustTransaction, 'id' | 'transactionNumber' | 'balanceAfter'>) => TrustTransaction;
  addOfficeExpense: (exp: Omit<OfficeExpense, 'id' | 'expenseNumber'>) => OfficeExpense;
  addTimeEntry: (entry: Omit<TimeEntry, 'id' | 'status'>) => TimeEntry;
  markTimeEntryBilled: (id: string) => void;
  addCommunication: (comm: Omit<CommunicationLog, 'id'>) => CommunicationLog;
  advanceWorkflowStage: (stageId: string) => void;
  runConflictCheck: (searchName: string) => ConflictResult;
  logAudit: (action: string, targetType: string, targetId: string, details: string) => void;
  resetToDemoData: () => void;
  formatKSh: (val: number) => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load or initialize state with localStorage
  const loadInitial = <T,>(key: string, fallback: T): T => {
    try {
      const saved = localStorage.getItem(`lfms_${key}`);
      return saved ? JSON.parse(saved) : fallback;
    } catch {
      return fallback;
    }
  };

  const [currentRole, setCurrentRole] = useState<UserRole>(() => loadInitial('role', 'managing_partner'));
  const [currentUser, setCurrentUser] = useState<UserProfile>(INITIAL_USERS[0]);
  const [clients, setClients] = useState<Client[]>(() => loadInitial('clients', INITIAL_CLIENTS));
  const [matters, setMatters] = useState<Matter[]>(() => loadInitial('matters', INITIAL_MATTERS));
  const [courtEvents, setCourtEvents] = useState<CourtEvent[]>(() => loadInitial('courtEvents', INITIAL_COURT_EVENTS));
  const [documents, setDocuments] = useState<LegalDocument[]>(() => loadInitial('documents', INITIAL_DOCUMENTS));
  const [tasks, setTasks] = useState<Task[]>(() => loadInitial('tasks', INITIAL_TASKS));
  const [invoices, setInvoices] = useState<Invoice[]>(() => loadInitial('invoices', INITIAL_INVOICES));
  const [receipts, setReceipts] = useState<PaymentReceipt[]>(() => loadInitial('receipts', INITIAL_RECEIPTS));
  const [trustTransactions, setTrustTransactions] = useState<TrustTransaction[]>(() => loadInitial('trustTransactions', INITIAL_TRUST_TRANSACTIONS));
  const [officeExpenses, setOfficeExpenses] = useState<OfficeExpense[]>(() => loadInitial('officeExpenses', INITIAL_OFFICE_EXPENSES));
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>(() => loadInitial('timeEntries', INITIAL_TIME_ENTRIES));
  const [communications, setCommunications] = useState<CommunicationLog[]>(() => loadInitial('communications', INITIAL_COMMUNICATIONS));
  const [conveyancingWorkflow, setConveyancingWorkflow] = useState<WorkflowStage[]>(() => loadInitial('workflow', INITIAL_CONVEYANCING_WORKFLOW));
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => loadInitial('auditLogs', INITIAL_AUDIT_LOGS));

  // Deployment Profile & Snapshot System State
  const [firmProfile, setFirmProfile] = useState<FirmDeploymentProfile>(() => loadInitial('firm_profile', DEFAULT_FIRM_PROFILE));
  const [snapshots, setSnapshots] = useState<SystemSnapshot[]>(() => {
    const existing = loadInitial<SystemSnapshot[]>('snapshots', []);
    if (existing && existing.length > 0) return existing;
    return [
      {
        id: 'snap-baseline-benchmark',
        name: 'Initial Practice Benchmark Snapshot',
        timestamp: '2026-09-28T08:00:00Z',
        environment: 'demo',
        description: 'Baseline Kenyan multi-disciplinary practice setup (6 core litigation & conveyancing matters).',
        autoCreated: false,
        recordCounts: {
          clients: INITIAL_CLIENTS.length,
          matters: INITIAL_MATTERS.length,
          courtEvents: INITIAL_COURT_EVENTS.length,
          documents: INITIAL_DOCUMENTS.length,
          tasks: INITIAL_TASKS.length,
          invoices: INITIAL_INVOICES.length,
          receipts: INITIAL_RECEIPTS.length,
          trustTransactions: INITIAL_TRUST_TRANSACTIONS.length,
          officeExpenses: INITIAL_OFFICE_EXPENSES.length,
          timeEntries: INITIAL_TIME_ENTRIES.length,
          communications: INITIAL_COMMUNICATIONS.length,
          auditLogs: INITIAL_AUDIT_LOGS.length
        },
        dataPayload: {
          clients: INITIAL_CLIENTS,
          matters: INITIAL_MATTERS,
          courtEvents: INITIAL_COURT_EVENTS,
          documents: INITIAL_DOCUMENTS,
          tasks: INITIAL_TASKS,
          invoices: INITIAL_INVOICES,
          receipts: INITIAL_RECEIPTS,
          trustTransactions: INITIAL_TRUST_TRANSACTIONS,
          officeExpenses: INITIAL_OFFICE_EXPENSES,
          timeEntries: INITIAL_TIME_ENTRIES,
          communications: INITIAL_COMMUNICATIONS,
          conveyancingWorkflow: INITIAL_CONVEYANCING_WORKFLOW,
          auditLogs: INITIAL_AUDIT_LOGS,
          profile: DEFAULT_FIRM_PROFILE
        }
      }
    ];
  });

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedMatterId, setSelectedMatterId] = useState<string | null>(null);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [isGlobalSearchOpen, setIsGlobalSearchOpen] = useState<boolean>(false);

  // Sync role to user
  useEffect(() => {
    localStorage.setItem('lfms_role', JSON.stringify(currentRole));
    if (currentRole === 'client') {
      // Find ABC Limited representative user profile or mock one
      setCurrentUser({
        id: 'u-client',
        name: 'Peter Munene (Client)',
        email: 'pmunene@abclimited.co.ke',
        role: 'client',
        phone: '+254 720 123 456',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
        title: 'Managing Director, ABC Limited'
      });
      setActiveTab('client-portal');
    } else {
      const match = INITIAL_USERS.find(u => u.role === currentRole) || INITIAL_USERS[0];
      setCurrentUser(match);
      if (activeTab === 'client-portal') {
        setActiveTab('dashboard');
      }
    }
  }, [currentRole]);

  // Persist datasets to localStorage
  useEffect(() => { localStorage.setItem('lfms_clients', JSON.stringify(clients)); }, [clients]);
  useEffect(() => { localStorage.setItem('lfms_matters', JSON.stringify(matters)); }, [matters]);
  useEffect(() => { localStorage.setItem('lfms_courtEvents', JSON.stringify(courtEvents)); }, [courtEvents]);
  useEffect(() => { localStorage.setItem('lfms_documents', JSON.stringify(documents)); }, [documents]);
  useEffect(() => { localStorage.setItem('lfms_tasks', JSON.stringify(tasks)); }, [tasks]);
  useEffect(() => { localStorage.setItem('lfms_invoices', JSON.stringify(invoices)); }, [invoices]);
  useEffect(() => { localStorage.setItem('lfms_receipts', JSON.stringify(receipts)); }, [receipts]);
  useEffect(() => { localStorage.setItem('lfms_trustTransactions', JSON.stringify(trustTransactions)); }, [trustTransactions]);
  useEffect(() => { localStorage.setItem('lfms_officeExpenses', JSON.stringify(officeExpenses)); }, [officeExpenses]);
  useEffect(() => { localStorage.setItem('lfms_timeEntries', JSON.stringify(timeEntries)); }, [timeEntries]);
  useEffect(() => { localStorage.setItem('lfms_communications', JSON.stringify(communications)); }, [communications]);
  useEffect(() => { localStorage.setItem('lfms_workflow', JSON.stringify(conveyancingWorkflow)); }, [conveyancingWorkflow]);
  useEffect(() => { localStorage.setItem('lfms_auditLogs', JSON.stringify(auditLogs)); }, [auditLogs]);
  useEffect(() => { localStorage.setItem('lfms_firm_profile', JSON.stringify(firmProfile)); }, [firmProfile]);
  useEffect(() => { localStorage.setItem('lfms_snapshots', JSON.stringify(snapshots)); }, [snapshots]);

  // Dynamic notifications engine based on court events, tasks, overdue invoices
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  useEffect(() => {
    const list: NotificationItem[] = [];
    
    // Check court events
    const today = new Date('2026-09-28'); // anchored to context date
    courtEvents.forEach(evt => {
      const evtDate = new Date(evt.date);
      const diffTime = evtDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        list.push({
          id: `notif-court-${evt.id}`,
          title: `⚠️ Court Hearing Tomorrow: ${evt.eventType}`,
          message: `${evt.matterTitle} at ${evt.court} (${evt.time})`,
          type: 'urgent',
          timestamp: 'Action required by 5:00 PM today',
          matterId: evt.matterId,
          linkTab: 'diary',
          read: false
        });
      } else if (diffDays > 1 && diffDays <= 3) {
        list.push({
          id: `notif-court-${evt.id}`,
          title: `🔔 Court Event in ${diffDays} Days: ${evt.eventType}`,
          message: `${evt.matterTitle} before ${evt.judgeName || evt.court}`,
          type: 'warning',
          timestamp: `Scheduled for ${evt.date}`,
          matterId: evt.matterId,
          linkTab: 'diary',
          read: false
        });
      }
    });

    // Check overdue tasks
    tasks.forEach(tsk => {
      if (tsk.status !== 'Complete' && tsk.deadline < '2026-09-28') {
        list.push({
          id: `notif-task-${tsk.id}`,
          title: `⚠️ Task Overdue: ${tsk.title}`,
          message: `Assigned to ${tsk.assignedToName} (${tsk.matterTitle})`,
          type: 'urgent',
          timestamp: `Deadline was ${tsk.deadline}`,
          matterId: tsk.matterId,
          linkTab: 'tasks',
          read: false
        });
      }
    });

    // Check overdue invoices
    invoices.forEach(inv => {
      if (inv.status === 'Overdue' || (inv.balanceDue > 0 && inv.dueDate < '2026-09-28')) {
        list.push({
          id: `notif-inv-${inv.id}`,
          title: `💰 Invoice Unpaid: ${inv.invoiceNumber}`,
          message: `${inv.clientName} owes KSh ${inv.balanceDue.toLocaleString()}`,
          type: 'warning',
          timestamp: `Due: ${inv.dueDate}`,
          matterId: inv.matterId,
          linkTab: 'billing',
          read: false
        });
      }
    });

    setNotifications(list);
  }, [courtEvents, tasks, invoices]);

  const logAudit = (action: string, targetType: string, targetId: string, details: string) => {
    const newLog: AuditLog = {
      id: `al-${Date.now()}`,
      timestamp: new Date().toLocaleString('en-GB', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      userName: currentUser.name,
      userRole: currentUser.title,
      action,
      targetType,
      targetId,
      details
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const switchRole = (role: UserRole) => {
    setCurrentRole(role);
    logAudit('Role Switched', 'User Session', role, `Switched context to ${role}`);
  };

  const addClient = (data: Omit<Client, 'id' | 'clientNumber' | 'matterCount' | 'outstandingBalance' | 'createdDate'> & { createdDate?: string }): Client => {
    const num = `CL-2026-${String(clients.length + 1).padStart(3, '0')}`;
    const newClient: Client = {
      ...data,
      id: `c-${Date.now()}`,
      clientNumber: num,
      matterCount: 0,
      outstandingBalance: 0,
      createdDate: data.createdDate || new Date().toISOString().split('T')[0]
    };
    setClients(prev => [newClient, ...prev]);
    logAudit('Created Client', 'Client CRM', newClient.clientNumber, `Registered ${newClient.name} (${newClient.type})`);
    return newClient;
  };

  const updateClient = (updated: Client) => {
    setClients(prev => prev.map(c => c.id === updated.id ? updated : c));
    logAudit('Updated Client', 'Client CRM', updated.clientNumber, `Updated details for ${updated.name}`);
  };

  const addMatter = (data: Omit<Matter, 'id' | 'matterNumber' | 'dateOpened'>): Matter => {
    const num = `LF/2026/${String(matters.length + 15).padStart(3, '0')}`;
    const newMatter: Matter = {
      ...data,
      id: `m-${Date.now()}`,
      matterNumber: num,
      dateOpened: new Date().toISOString().split('T')[0]
    };
    setMatters(prev => [newMatter, ...prev]);
    // increment client matter count
    setClients(prev => prev.map(c => c.id === data.clientId ? { ...c, matterCount: c.matterCount + 1 } : c));
    logAudit('Opened New Matter', 'Matter File', newMatter.matterNumber, `Opened ${newMatter.title} (${newMatter.category})`);
    return newMatter;
  };

  const updateMatter = (updated: Matter) => {
    setMatters(prev => prev.map(m => m.id === updated.id ? updated : m));
    logAudit('Updated Matter', 'Matter File', updated.matterNumber, `Updated status to ${updated.status}`);
  };

  const addCourtEvent = (data: Omit<CourtEvent, 'id'>): CourtEvent => {
    const newEvent: CourtEvent = {
      ...data,
      id: `ce-${Date.now()}`
    };
    setCourtEvents(prev => [...prev, newEvent].sort((a, b) => a.date.localeCompare(b.date)));
    logAudit('Scheduled Court Event', 'Court Diary', newEvent.matterNumber, `Scheduled ${newEvent.eventType} for ${newEvent.date}`);
    return newEvent;
  };

  const addDocument = (data: Omit<LegalDocument, 'id' | 'uploadedAt' | 'version'> & { uploadedAt?: string; uploadedDate?: string }): LegalDocument => {
    const newDoc: LegalDocument = {
      ...data,
      id: `doc-${Date.now()}`,
      uploadedAt: data.uploadedAt || data.uploadedDate || new Date().toISOString().split('T')[0],
      uploadedDate: data.uploadedDate || data.uploadedAt || new Date().toISOString().split('T')[0],
      version: 'v1.0'
    };
    setDocuments(prev => [newDoc, ...prev]);
    logAudit('Uploaded Legal Document', 'Digital Archive', newDoc.matterNumber, `Uploaded ${newDoc.title} (${newDoc.category})`);
    return newDoc;
  };

  const addTask = (data: Omit<Task, 'id'>): Task => {
    const newTask: Task = {
      ...data,
      id: `tsk-${Date.now()}`
    };
    setTasks(prev => [newTask, ...prev]);
    logAudit('Created Task', 'Workflow Task', newTask.matterNumber, `Assigned "${newTask.title}" to ${newTask.assignedToName}`);
    return newTask;
  };

  const updateTaskStatus = (taskId: string, status: Task['status']) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return {
          ...t,
          status,
          completedAt: status === 'Complete' ? new Date().toISOString().split('T')[0] : undefined
        };
      }
      return t;
    }));
    logAudit('Updated Task Status', 'Workflow Task', taskId, `Status changed to ${status}`);
  };

  const addInvoice = (data: Omit<Invoice, 'id' | 'invoiceNumber'>): Invoice => {
    const num = `INV-2026-${String(invoices.length + 80).padStart(3, '0')}`;
    const newInvoice: Invoice = {
      ...data,
      id: `inv-${Date.now()}`,
      invoiceNumber: num
    };
    setInvoices(prev => [newInvoice, ...prev]);
    // update client outstanding balance
    setClients(prev => prev.map(c => c.id === data.clientId ? { ...c, outstandingBalance: c.outstandingBalance + newInvoice.balanceDue } : c));
    logAudit('Generated Fee Note', 'Finance & Billing', newInvoice.invoiceNumber, `Issued invoice of KSh ${newInvoice.totalAmount.toLocaleString()} to ${newInvoice.clientName}`);
    return newInvoice;
  };

  const recordPayment = (receiptData: {
    invoiceId: string;
    amount: number;
    paymentMethod: PaymentReceipt['paymentMethod'];
    referenceNumber: string;
    accountType: 'office' | 'trust';
  }) => {
    const inv = invoices.find(i => i.id === receiptData.invoiceId);
    if (!inv) return;

    const receiptNum = `REC-2026-${String(receipts.length + 50).padStart(4, '0')}`;
    const newReceipt: PaymentReceipt = {
      id: `rec-${Date.now()}`,
      receiptNumber: receiptNum,
      invoiceId: inv.id,
      invoiceNumber: inv.invoiceNumber,
      matterId: inv.matterId,
      clientName: inv.clientName,
      amount: receiptData.amount,
      paymentMethod: receiptData.paymentMethod,
      referenceNumber: receiptData.referenceNumber,
      date: new Date().toISOString().split('T')[0],
      accountType: receiptData.accountType,
      receivedBy: currentUser.name
    };

    setReceipts(prev => [newReceipt, ...prev]);

    // Update invoice amountPaid & balanceDue
    setInvoices(prev => prev.map(i => {
      if (i.id === inv.id) {
        const newPaid = i.amountPaid + receiptData.amount;
        const newBalance = Math.max(0, i.totalAmount - newPaid);
        return {
          ...i,
          amountPaid: newPaid,
          balanceDue: newBalance,
          status: newBalance <= 0 ? 'Paid' : 'Partially Paid'
        };
      }
      return i;
    }));

    // Update client balance
    setClients(prev => prev.map(c => {
      if (c.id === inv.clientId) {
        return {
          ...c,
          outstandingBalance: Math.max(0, c.outstandingBalance - receiptData.amount)
        };
      }
      return c;
    }));

    logAudit('Recorded Payment', 'Accounts & Cashier', newReceipt.receiptNumber, `Received KSh ${receiptData.amount.toLocaleString()} for ${inv.invoiceNumber} (${receiptData.paymentMethod})`);
  };

  const addTrustTransaction = (data: Omit<TrustTransaction, 'id' | 'transactionNumber' | 'balanceAfter'>): TrustTransaction => {
    const num = `TR-2026-${String(trustTransactions.length + 30).padStart(4, '0')}`;
    const currentTrustTotal = trustTransactions.reduce((acc, curr) => {
      return curr.type === 'deposit_received' ? acc + curr.amount : acc - curr.amount;
    }, 0);

    const delta = data.type === 'deposit_received' ? data.amount : -data.amount;
    const newBalance = currentTrustTotal + delta;

    const newTx: TrustTransaction = {
      ...data,
      id: `tr-${Date.now()}`,
      transactionNumber: num,
      balanceAfter: newBalance
    };

    setTrustTransactions(prev => [newTx, ...prev]);
    logAudit('Advocates Trust Account Entry', 'Trust Ledger', newTx.transactionNumber, `${data.type.toUpperCase()}: KSh ${data.amount.toLocaleString()} for ${data.matterTitle}`);
    return newTx;
  };

  const addOfficeExpense = (data: Omit<OfficeExpense, 'id' | 'expenseNumber'>): OfficeExpense => {
    const num = `EXP-2026-${String(officeExpenses.length + 100).padStart(3, '0')}`;
    const newExp: OfficeExpense = {
      ...data,
      id: `exp-${Date.now()}`,
      expenseNumber: num
    };
    setOfficeExpenses(prev => [newExp, ...prev]);
    logAudit('Approved Office Expense', 'Firm Operational Ledger', newExp.expenseNumber, `KSh ${newExp.amount.toLocaleString()} - ${newExp.description}`);
    return newExp;
  };

  const addTimeEntry = (data: Omit<TimeEntry, 'id' | 'status'>): TimeEntry => {
    const newEntry: TimeEntry = {
      ...data,
      id: `te-${Date.now()}`,
      status: 'unbilled'
    };
    setTimeEntries(prev => [newEntry, ...prev]);
    logAudit('Logged Billable Time', 'Time Sheet', newEntry.matterNumber, `${newEntry.hours} hrs for ${newEntry.activity} (${newEntry.advocateName})`);
    return newEntry;
  };

  const markTimeEntryBilled = (id: string) => {
    setTimeEntries(prev => prev.map(te => te.id === id ? { ...te, status: 'billed' } : te));
  };

  const addCommunication = (data: Omit<CommunicationLog, 'id'>): CommunicationLog => {
    const newComm: CommunicationLog = {
      ...data,
      id: `comm-${Date.now()}`
    };
    setCommunications(prev => [newComm, ...prev]);
    logAudit('Logged Communication', 'Correspondence', newComm.matterNumber, `${newComm.type} between ${newComm.sender} and ${newComm.recipient}`);
    return newComm;
  };

  const advanceWorkflowStage = (stageId: string) => {
    setConveyancingWorkflow(prev => {
      const idx = prev.findIndex(s => s.id === stageId);
      if (idx === -1) return prev;
      return prev.map((stage, i) => {
        if (i < idx) {
          return { ...stage, status: 'completed' as const };
        } else if (i === idx) {
          return { ...stage, status: 'completed' as const, completedDate: new Date().toISOString().split('T')[0] };
        } else if (i === idx + 1) {
          return { ...stage, status: 'current' as const };
        } else {
          return { ...stage, status: 'upcoming' as const };
        }
      });
    });
    logAudit('Workflow Advanced', 'Conveyancing Pipeline', stageId, `Stage marked complete`);
  };

  const runConflictCheck = (searchName: string): ConflictResult => {
    if (!searchName.trim()) return { hasConflict: false, score: 0, matches: [] };
    const query = searchName.toLowerCase().trim();
    const matches: ConflictResult['matches'] = [];

    // Check existing clients
    clients.forEach(c => {
      if (c.name.toLowerCase().includes(query) || (c.contactPerson && c.contactPerson.toLowerCase().includes(query))) {
        matches.push({
          type: 'Client',
          name: c.name,
          details: `Registered client (${c.type}) | KRA PIN: ${c.kraPin}`
        });
      }
    });

    // Check opposing parties in active matters
    matters.forEach(m => {
      if (m.opposingParty.toLowerCase().includes(query)) {
        matches.push({
          type: 'Matter Opposing Party',
          name: m.opposingParty,
          details: `Adverse party in Matter: ${m.title} (${m.matterNumber})`,
          matterNumber: m.matterNumber
        });
      }
      if (m.clientName.toLowerCase().includes(query)) {
        matches.push({
          type: 'Matter Co-Party',
          name: m.clientName,
          details: `Represented party in Matter: ${m.title} (${m.matterNumber})`,
          matterNumber: m.matterNumber
        });
      }
    });

    const hasConflict = matches.length > 0;
    const score = hasConflict ? (matches.some(m => m.type === 'Matter Opposing Party') ? 95 : 60) : 0;
    return { hasConflict, score, matches };
  };

  // Deployment & Reset Engine Methods
  const updateFirmProfile = (updates: Partial<FirmDeploymentProfile>) => {
    setFirmProfile(prev => ({ ...prev, ...updates }));
    logAudit('UPDATE_FIRM_PROFILE', 'FIRM_PROFILE', 'SETTINGS', `Updated firm deployment profile configurations.`);
  };

  const createSnapshot = (name: string, description: string = '', autoCreated: boolean = false): SystemSnapshot => {
    const newSnapshot: SystemSnapshot = {
      id: `snap-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name: name.trim() || `Snapshot ${new Date().toLocaleString('en-KE')}`,
      timestamp: new Date().toISOString(),
      environment: firmProfile.environment,
      description: description || (autoCreated ? 'Automated pre-deployment/reset recovery point.' : 'Manual system checkpoint.'),
      autoCreated,
      recordCounts: {
        clients: clients.length,
        matters: matters.length,
        courtEvents: courtEvents.length,
        documents: documents.length,
        tasks: tasks.length,
        invoices: invoices.length,
        receipts: receipts.length,
        trustTransactions: trustTransactions.length,
        officeExpenses: officeExpenses.length,
        timeEntries: timeEntries.length,
        communications: communications.length,
        auditLogs: auditLogs.length
      },
      dataPayload: {
        clients: [...clients],
        matters: [...matters],
        courtEvents: [...courtEvents],
        documents: [...documents],
        tasks: [...tasks],
        invoices: [...invoices],
        receipts: [...receipts],
        trustTransactions: [...trustTransactions],
        officeExpenses: [...officeExpenses],
        timeEntries: [...timeEntries],
        communications: [...communications],
        conveyancingWorkflow: [...conveyancingWorkflow],
        auditLogs: [...auditLogs],
        profile: { ...firmProfile }
      }
    };

    setSnapshots(prev => [newSnapshot, ...prev]);
    logAudit('CREATE_SNAPSHOT', 'SYSTEM_SNAPSHOT', newSnapshot.id, `Created snapshot: "${newSnapshot.name}" (${newSnapshot.recordCounts.matters} matters, ${newSnapshot.recordCounts.clients} clients)`);
    return newSnapshot;
  };

  const restoreSnapshot = (snapshotId: string): boolean => {
    const target = snapshots.find(s => s.id === snapshotId);
    if (!target) return false;

    // Create an automatic recovery point before restoring
    createSnapshot(`Auto-Backup Before Restoring "${target.name}"`, 'Pre-restore safety snapshot', true);

    const p = target.dataPayload;
    setClients(p.clients || []);
    setMatters(p.matters || []);
    setCourtEvents(p.courtEvents || []);
    setDocuments(p.documents || []);
    setTasks(p.tasks || []);
    setInvoices(p.invoices || []);
    setReceipts(p.receipts || []);
    setTrustTransactions(p.trustTransactions || []);
    setOfficeExpenses(p.officeExpenses || []);
    setTimeEntries(p.timeEntries || []);
    setCommunications(p.communications || []);
    setConveyancingWorkflow(p.conveyancingWorkflow || INITIAL_CONVEYANCING_WORKFLOW);
    setAuditLogs(p.auditLogs || []);
    if (p.profile) {
      setFirmProfile(p.profile);
    }

    logAudit('RESTORE_SNAPSHOT', 'SYSTEM_SNAPSHOT', target.id, `Restored database to snapshot: "${target.name}" from ${target.timestamp}`);
    return true;
  };

  const deleteSnapshot = (snapshotId: string) => {
    setSnapshots(prev => prev.filter(s => s.id !== snapshotId));
    logAudit('DELETE_SNAPSHOT', 'SYSTEM_SNAPSHOT', snapshotId, `Removed snapshot ${snapshotId} from snapshot archive`);
  };

  const deployPreset = (presetId: string): boolean => {
    const template = DEPLOYMENT_TEMPLATES.find(t => t.id === presetId);
    if (!template) return false;

    // Auto-create snapshot of current state before deploying template
    createSnapshot(`Auto-Backup before Deploying "${template.name}"`, `State prior to deploying preset: ${template.name}`, true);

    const d = template.data;
    setClients(d.clients);
    setMatters(d.matters);
    setCourtEvents(d.courtEvents);
    setDocuments(d.documents);
    setTasks(d.tasks);
    setInvoices(d.invoices);
    setReceipts(d.receipts);
    setTrustTransactions(d.trustTransactions);
    setOfficeExpenses(d.officeExpenses);
    setTimeEntries(d.timeEntries);
    setCommunications(d.communications);
    setConveyancingWorkflow(d.conveyancingWorkflow);
    setAuditLogs(d.auditLogs);

    setFirmProfile(prev => ({
      ...prev,
      environment: template.environmentTarget,
      lastDeployedAt: new Date().toISOString()
    }));

    logAudit('DEPLOY_PRESET', 'DEPLOYMENT_TEMPLATE', template.id, `Deployed preset "${template.name}" (Env: ${template.environmentTarget})`);
    return true;
  };

  const executeSelectiveReset = (
    scope: ResetScope,
    options?: { confirmPhrase?: string; memo?: string }
  ): boolean => {
    if (options?.confirmPhrase && 
        options.confirmPhrase.trim().toUpperCase() !== 'CONFIRM-RESET' && 
        options.confirmPhrase.trim().toUpperCase() !== 'RESET-PRACTICE-DATABASE') {
      return false;
    }

    // Auto-create snapshot before reset
    createSnapshot(
      options?.memo?.trim() ? `Auto-Backup: ${options.memo}` : `Auto-Backup before Selective Reset`,
      'System-generated rollback point captured prior to selective domain reset.',
      true
    );

    if (scope.clients) setClients([]);
    if (scope.matters) setMatters([]);
    if (scope.courtDiary) setCourtEvents([]);
    if (scope.documents) setDocuments([]);
    if (scope.tasks) setTasks([]);
    if (scope.invoicesAndReceipts) {
      setInvoices([]);
      setReceipts([]);
    }
    if (scope.trustLedger) setTrustTransactions([]);
    if (scope.officeExpenses) setOfficeExpenses([]);
    if (scope.timeEntries) setTimeEntries([]);
    if (scope.communications) setCommunications([]);
    if (scope.workflowProgress) {
      setConveyancingWorkflow(INITIAL_CONVEYANCING_WORKFLOW.map(s => ({
        ...s,
        status: s.order === 1 ? 'current' : 'upcoming',
        completedDate: undefined
      })));
    }

    const resetDomains: string[] = [];
    if (scope.clients) resetDomains.push('Clients');
    if (scope.matters) resetDomains.push('Matters');
    if (scope.courtDiary) resetDomains.push('Court Diary');
    if (scope.documents) resetDomains.push('Documents');
    if (scope.tasks) resetDomains.push('Tasks');
    if (scope.invoicesAndReceipts) resetDomains.push('Invoices & Receipts');
    if (scope.trustLedger) resetDomains.push('Trust Transactions');
    if (scope.officeExpenses) resetDomains.push('Office Expenses');
    if (scope.timeEntries) resetDomains.push('Time Tracking');
    if (scope.communications) resetDomains.push('Communications');
    if (scope.workflowProgress) resetDomains.push('Workflows');

    const auditEntry: AuditLog = {
      id: `audit-reset-${Date.now()}`,
      timestamp: new Date().toISOString(),
      userName: currentUser.name,
      userRole: currentUser.title,
      action: 'SELECTIVE_RESET_EXECUTED',
      targetType: 'SYSTEM_DATABASE',
      targetId: 'SELECTIVE_SCOPES',
      details: `Executed selective reset on domains: ${resetDomains.join(', ')}. Memo: ${options?.memo || 'No memo provided'}`
    };

    if (scope.auditLogs) {
      setAuditLogs([auditEntry]);
    } else {
      setAuditLogs(prev => [auditEntry, ...prev]);
    }

    return true;
  };

  const runIntegrityDiagnostics = (): SystemIntegrityReport => {
    let calculatedTrustTotal = 0;
    trustTransactions.forEach(tx => {
      if (tx.type === 'deposit_received') {
        calculatedTrustTotal += tx.amount;
      } else {
        calculatedTrustTotal -= tx.amount;
      }
    });

    const clientOutstandingTotal = clients.reduce((acc, c) => acc + (c.outstandingBalance || 0), 0);
    const lastBalance = trustTransactions.length > 0 
      ? trustTransactions[trustTransactions.length - 1].balanceAfter 
      : 0;
    
    const trustDiscrepancy = Math.abs(calculatedTrustTotal - lastBalance);
    const trustAccountReconciled = trustDiscrepancy < 0.01;

    const clientIds = new Set(clients.map(c => c.id));
    const orphanMatters = matters.filter(m => !clientIds.has(m.clientId));
    const missingAdvocateEvents = courtEvents.filter(e => !e.advocateAssigned || e.advocateAssigned.trim() === '');

    const unbilledEntries = timeEntries.filter(t => t.status === 'unbilled');
    const unbilledHoursCount = unbilledEntries.reduce((acc, t) => acc + t.hours, 0);
    const unbilledHoursValue = unbilledEntries.reduce((acc, t) => acc + (t.hours * t.hourlyRate), 0);

    const payload = JSON.stringify({ clients, matters, courtEvents, documents, tasks, invoices, trustTransactions });
    const storageKb = Math.round((new Blob([payload]).size) / 1024);

    const issues: SystemIntegrityReport['issues'] = [];

    if (!trustAccountReconciled && trustTransactions.length > 0) {
      issues.push({
        severity: 'critical',
        category: 'Trust Accounting & Statutory Compliance',
        message: `Trust account running balance discrepancy detected (Advocates Accounts Rules Cap 16): calculated net ledger balance differs from statement by ${formatKSh(trustDiscrepancy)}.`
      });
    }

    if (orphanMatters.length > 0) {
      issues.push({
        severity: 'warning',
        category: 'Matter Integrity',
        message: `Found ${orphanMatters.length} matter(s) referencing unlinked client records (e.g. ${orphanMatters[0].matterNumber}).`
      });
    }

    if (missingAdvocateEvents.length > 0) {
      issues.push({
        severity: 'critical',
        category: 'Court Diary Risk',
        message: `Found ${missingAdvocateEvents.length} court event(s) without an assigned advocate on record.`
      });
    }

    if (unbilledHoursCount > 0) {
      issues.push({
        severity: 'info',
        category: 'Revenue Realization',
        message: `${unbilledHoursCount} unbilled hours worth ${formatKSh(unbilledHoursValue)} pending conversion to fee notes.`
      });
    }

    let checksPassed = 0;
    const totalChecks = 6;
    if (trustAccountReconciled) checksPassed++;
    if (orphanMatters.length === 0) checksPassed++;
    if (missingAdvocateEvents.length === 0) checksPassed++;
    if (clients.length >= 0) checksPassed++;
    if (firmProfile.lskFirmNumber.length > 0) checksPassed++;
    if (firmProfile.trustAccountNumber.length > 0) checksPassed++;

    const healthScore = Math.round((checksPassed / totalChecks) * 100);

    return {
      timestamp: new Date().toISOString(),
      trustAccountReconciled,
      trustLedgerTotal: lastBalance,
      clientBalancesTotal: clientOutstandingTotal,
      trustDiscrepancy,
      orphanMattersCount: orphanMatters.length,
      courtEventsWithoutAdvocateCount: missingAdvocateEvents.length,
      unbilledHoursCount,
      unbilledHoursValue,
      totalStorageEstimateKb: storageKb,
      checksPassed,
      totalChecks,
      healthScore,
      issues
    };
  };

  const exportDatabaseJson = (): string => {
    const exportData = {
      exportVersion: '2.6',
      exportedAt: new Date().toISOString(),
      firmProfile,
      clients,
      matters,
      courtEvents,
      documents,
      tasks,
      invoices,
      receipts,
      trustTransactions,
      officeExpenses,
      timeEntries,
      communications,
      conveyancingWorkflow,
      auditLogs
    };
    return JSON.stringify(exportData, null, 2);
  };

  const importDatabaseJson = (jsonString: string): { success: boolean; message: string; recordCounts?: Record<string, number> } => {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed || typeof parsed !== 'object') {
        return { success: false, message: 'Invalid JSON payload. File must be a valid LFMS database backup.' };
      }

      createSnapshot('Auto-Backup Before JSON Import', 'Automatic recovery point before external database import', true);

      if (parsed.firmProfile) setFirmProfile(parsed.firmProfile);
      if (Array.isArray(parsed.clients)) setClients(parsed.clients);
      if (Array.isArray(parsed.matters)) setMatters(parsed.matters);
      if (Array.isArray(parsed.courtEvents)) setCourtEvents(parsed.courtEvents);
      if (Array.isArray(parsed.documents)) setDocuments(parsed.documents);
      if (Array.isArray(parsed.tasks)) setTasks(parsed.tasks);
      if (Array.isArray(parsed.invoices)) setInvoices(parsed.invoices);
      if (Array.isArray(parsed.receipts)) setReceipts(parsed.receipts);
      if (Array.isArray(parsed.trustTransactions)) setTrustTransactions(parsed.trustTransactions);
      if (Array.isArray(parsed.officeExpenses)) setOfficeExpenses(parsed.officeExpenses);
      if (Array.isArray(parsed.timeEntries)) setTimeEntries(parsed.timeEntries);
      if (Array.isArray(parsed.communications)) setCommunications(parsed.communications);
      if (Array.isArray(parsed.conveyancingWorkflow)) setConveyancingWorkflow(parsed.conveyancingWorkflow);
      if (Array.isArray(parsed.auditLogs)) setAuditLogs(parsed.auditLogs);

      const recordCounts = {
        clients: parsed.clients?.length || 0,
        matters: parsed.matters?.length || 0,
        courtEvents: parsed.courtEvents?.length || 0,
        invoices: parsed.invoices?.length || 0
      };

      logAudit('IMPORT_DATABASE_JSON', 'DATABASE_BACKUP', 'FILE_IMPORT', `Imported external JSON backup with ${recordCounts.matters} matters, ${recordCounts.clients} clients.`);

      return {
        success: true,
        message: `Successfully restored backup with ${recordCounts.matters} matters and ${recordCounts.clients} clients.`,
        recordCounts
      };
    } catch (err: any) {
      return {
        success: false,
        message: `JSON parse error: ${err?.message || 'Corrupted file content'}`
      };
    }
  };

  const resetToDemoData = () => {
    deployPreset('standard_kenya');
    setCurrentRole('managing_partner');
    setActiveTab('dashboard');
  };

  const formatKSh = (val: number) => {
    return `KSh ${Number(val || 0).toLocaleString('en-KE', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        currentRole,
        switchRole,
        clients,
        matters,
        courtEvents,
        documents,
        tasks,
        invoices,
        receipts,
        trustTransactions,
        officeExpenses,
        timeEntries,
        communications,
        auditLogs,
        conveyancingWorkflow,
        notifications,
        activeTab,
        setActiveTab,
        selectedMatterId,
        setSelectedMatterId,
        selectedClientId,
        setSelectedClientId,
        isGlobalSearchOpen,
        setIsGlobalSearchOpen,
        firmProfile,
        updateFirmProfile,
        snapshots,
        createSnapshot,
        restoreSnapshot,
        deleteSnapshot,
        deployPreset,
        executeSelectiveReset,
        runIntegrityDiagnostics,
        exportDatabaseJson,
        importDatabaseJson,
        addClient,
        updateClient,
        addMatter,
        updateMatter,
        addCourtEvent,
        addDocument,
        addTask,
        updateTaskStatus,
        addInvoice,
        recordPayment,
        addTrustTransaction,
        addOfficeExpense,
        addTimeEntry,
        markTimeEntryBilled,
        addCommunication,
        advanceWorkflowStage,
        runConflictCheck,
        logAudit,
        resetToDemoData,
        formatKSh
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
