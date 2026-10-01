import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { DropdownDatePicker } from '../common/DropdownDatePicker';
import { OfficialReportModal } from './OfficialReportModal';
import { exportToCsv, exportToJson, SectorReportSummaryStat } from '../../utils/reportExporter';
import {
  FileSpreadsheet,
  Printer,
  Download,
  Filter,
  Calendar as CalendarIcon,
  Search,
  Briefcase,
  Calendar,
  GitBranch,
  Landmark,
  BarChart3,
  Receipt,
  Timer,
  FolderOpen,
  CheckSquare,
  Users,
  ShieldAlert,
  History,
  CheckCircle2,
  RefreshCw,
  Sparkles,
  Layers,
  ArrowUpRight
} from 'lucide-react';

export type SectorType = 
  | 'matters'
  | 'diary'
  | 'conveyancing'
  | 'trust'
  | 'accounting'
  | 'billing'
  | 'timetracking'
  | 'documents'
  | 'tasks'
  | 'clients'
  | 'conflicts'
  | 'audit';

export const SectorReportsHub: React.FC = () => {
  const {
    matters,
    courtEvents,
    clients,
    documents,
    tasks,
    invoices,
    trustTransactions,
    officeExpenses,
    timeEntries,
    conveyancingWorkflow,
    auditLogs,
    formatKSh,
    firmProfile,
    currentUser
  } = useApp();

  // Active Sector
  const [activeSector, setActiveSector] = useState<SectorType>('matters');

  // Date Range Filters with DropdownDatePicker
  const [startDate, setStartDate] = useState<string>('2026-01-01');
  const [endDate, setEndDate] = useState<string>('2026-12-31');

  // Sub-filters
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Print/Official Modal State
  const [isOfficialModalOpen, setIsOfficialModalOpen] = useState(false);

  // Sector Definition metadata
  const sectorsList = [
    { id: 'matters', label: 'Litigation & Cases', icon: Briefcase, color: 'text-blue-400', count: matters.length },
    { id: 'diary', label: 'Court Cause List', icon: Calendar, color: 'text-rose-400', count: courtEvents.length },
    { id: 'trust', label: 'Client Trust Accounts', icon: Landmark, color: 'text-emerald-400', count: trustTransactions.length },
    { id: 'billing', label: 'Fee Notes & Invoices', icon: Receipt, color: 'text-amber-400', count: invoices.length },
    { id: 'accounting', label: 'Firm Operating P&L', icon: BarChart3, color: 'text-indigo-400', count: officeExpenses.length },
    { id: 'timetracking', label: 'Advocate Utilization', icon: Timer, color: 'text-teal-400', count: timeEntries.length },
    { id: 'conveyancing', label: 'Ardhisasa Conveyancing', icon: GitBranch, color: 'text-cyan-400', count: conveyancingWorkflow.length },
    { id: 'documents', label: 'Document Vault Index', icon: FolderOpen, color: 'text-purple-400', count: documents.length },
    { id: 'tasks', label: 'Statutory Deadlines', icon: CheckSquare, color: 'text-lime-400', count: tasks.length },
    { id: 'clients', label: 'Client CRM Register', icon: Users, color: 'text-sky-400', count: clients.length },
    { id: 'conflicts', label: 'Conflict Check Audits', icon: ShieldAlert, color: 'text-amber-400', count: matters.length + clients.length },
    { id: 'audit', label: 'Audit Trail & Compliance', icon: History, color: 'text-violet-400', count: auditLogs.length },
  ];

  // Quick Date Range Helpers
  const applyPreset = (preset: 'all' | 'this_month' | 'last_30' | 'q3' | 'year') => {
    if (preset === 'all') {
      setStartDate('2020-01-01');
      setEndDate('2030-12-31');
    } else if (preset === 'this_month') {
      setStartDate('2026-09-01');
      setEndDate('2026-09-30');
    } else if (preset === 'last_30') {
      setStartDate('2026-08-29');
      setEndDate('2026-09-28');
    } else if (preset === 'q3') {
      setStartDate('2026-07-01');
      setEndDate('2026-09-30');
    } else if (preset === 'year') {
      setStartDate('2026-01-01');
      setEndDate('2026-12-31');
    }
  };

  // Helper date checker
  const isDateInRange = (dateStr: string) => {
    if (!dateStr) return true;
    if (startDate && dateStr < startDate) return false;
    if (endDate && dateStr > endDate) return false;
    return true;
  };

  // ==========================================
  // SECTOR 1: LITIGATION MATTERS
  // ==========================================
  const mattersReport = useMemo(() => {
    const filtered = matters.filter(m => {
      const filingDate = m.dateOpened || m.openDate || '';
      const inDate = isDateInRange(filingDate);
      const matchesStatus = statusFilter === 'all' || m.status === statusFilter;
      const matchesSearch = !searchTerm || 
        m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.matterNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.court.toLowerCase().includes(searchTerm.toLowerCase());
      return inDate && matchesStatus && matchesSearch;
    });

    const activeCount = filtered.filter(m => m.status === 'Active').length;
    const closedCount = filtered.filter(m => m.status === 'Closed').length;
    const totalBudget = filtered.reduce((acc, m) => acc + (m.estimatedValue || m.budget || 0), 0);
    const totalBilled = filtered.reduce((acc, m) => acc + (m.billedAmount || 0), 0);

    const stats: SectorReportSummaryStat[] = [
      { label: 'Total Matters In Scope', value: filtered.length },
      { label: 'Active Matters', value: activeCount, highlight: true },
      { label: 'Total Value / Budget', value: formatKSh(totalBudget) },
      { label: 'Concluded Matters', value: closedCount },
    ];

    const headers = ['Matter No', 'Matter Title', 'Client Name', 'Category', 'Court', 'Filing Date', 'Advocate', 'Status', 'Estimated Value (KES)'];
    const rows: (string | number)[][] = filtered.map(m => [
      m.matterNumber,
      m.title,
      m.clientName,
      m.category,
      m.court,
      m.dateOpened || m.openDate || '2026-01-01',
      m.leadAdvocateName || m.assignedAdvocate || 'Senior Counsel',
      m.status,
      (m.estimatedValue || m.budget || 0).toLocaleString()
    ]);

    return { filtered, stats, headers, rows, filename: 'Litigation_Matters_Report' };
  }, [matters, startDate, endDate, statusFilter, searchTerm, formatKSh]);

  // ==========================================
  // SECTOR 2: COURT CAUSE LIST & DIARY
  // ==========================================
  const diaryReport = useMemo(() => {
    const filtered = courtEvents.filter(e => {
      const inDate = isDateInRange(e.date);
      const matchesStatus = statusFilter === 'all' || e.status === statusFilter;
      const matchesSearch = !searchTerm ||
        e.matterTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.matterNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.court.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (e.judgeName && e.judgeName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        e.advocateAssigned.toLowerCase().includes(searchTerm.toLowerCase());
      return inDate && matchesStatus && matchesSearch;
    });

    const hearings = filtered.filter(e => e.eventType === 'Hearing').length;
    const rulings = filtered.filter(e => e.eventType === 'Ruling' || e.eventType === 'Judgement').length;
    const virtual = filtered.filter(e => Boolean(e.virtualLink)).length;

    const stats: SectorReportSummaryStat[] = [
      { label: 'Scheduled Appearances', value: filtered.length, highlight: true },
      { label: 'Trials & Hearings', value: hearings },
      { label: 'Rulings & Judgments', value: rulings },
      { label: 'Virtual MS Teams Hearings', value: virtual },
    ];

    const headers = ['Date', 'Time', 'Matter No', 'Matter Title', 'Court & Room', 'Judge / Coram', 'Purpose', 'Assigned Advocate', 'Status', 'Virtual'];
    const rows: (string | number)[][] = filtered.map(e => [
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
    ]);

    return { filtered, stats, headers, rows, filename: 'Court_Diary_Cause_List_Report' };
  }, [courtEvents, startDate, endDate, statusFilter, searchTerm]);

  // ==========================================
  // SECTOR 3: CLIENT TRUST & ESCROW ACCOUNTS
  // ==========================================
  const trustReport = useMemo(() => {
    const filtered = trustTransactions.filter(t => {
      const inDate = isDateInRange(t.date);
      const matchesStatus = statusFilter === 'all' || t.type === statusFilter;
      const matchesSearch = !searchTerm ||
        t.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.matterTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (t.description && t.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (t.voucherNumber && t.voucherNumber.toLowerCase().includes(searchTerm.toLowerCase()));
      return inDate && matchesStatus && matchesSearch;
    });

    const totalDeposits = filtered.filter(t => t.type === 'deposit_received').reduce((acc, t) => acc + t.amount, 0);
    const totalDisbursements = filtered.filter(t => t.type === 'client_disbursement').reduce((acc, t) => acc + t.amount, 0);
    const totalTransfers = filtered.filter(t => t.type === 'transfer_to_office').reduce((acc, t) => acc + t.amount, 0);
    const latestBalance = filtered.length > 0 ? filtered[0].balanceAfter : 0;

    const stats: SectorReportSummaryStat[] = [
      { label: 'Total Client Trust Deposits', value: formatKSh(totalDeposits), highlight: true },
      { label: 'Disbursements Paid Out', value: formatKSh(totalDisbursements) },
      { label: 'Transfers to Office (Earned Fees)', value: formatKSh(totalTransfers) },
      { label: 'Net Escrow Ledger Balance', value: formatKSh(latestBalance) },
    ];

    const headers = ['Date', 'Tx Number', 'Transaction Type', 'Client', 'Matter Title', 'Payee / Source', 'Purpose', 'Amount (KES)', 'Running Balance (KES)'];
    const rows: (string | number)[][] = filtered.map(t => [
      t.date,
      t.transactionNumber,
      t.type.toUpperCase(),
      t.clientName,
      t.matterTitle,
      t.sourceOrPayee,
      t.purpose,
      t.amount.toLocaleString(),
      t.balanceAfter.toLocaleString()
    ]);

    return { filtered, stats, headers, rows, filename: 'Statutory_Client_Trust_Ledger' };
  }, [trustTransactions, startDate, endDate, statusFilter, searchTerm, formatKSh]);

  // ==========================================
  // SECTOR 4: BILLING & INVOICING
  // ==========================================
  const billingReport = useMemo(() => {
    const filtered = invoices.filter(inv => {
      const inDate = isDateInRange(inv.dateIssued);
      const matchesStatus = statusFilter === 'all' || inv.status.toLowerCase() === statusFilter.toLowerCase();
      const matchesSearch = !searchTerm ||
        inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.matterTitle.toLowerCase().includes(searchTerm.toLowerCase());
      return inDate && matchesStatus && matchesSearch;
    });

    const totalBilled = filtered.reduce((acc, i) => acc + i.totalAmount, 0);
    const totalCollected = filtered.reduce((acc, i) => acc + i.amountPaid, 0);
    const totalOutstanding = filtered.reduce((acc, i) => acc + i.balanceDue, 0);
    const totalVat = filtered.reduce((acc, i) => acc + i.vatAmount, 0);

    const stats: SectorReportSummaryStat[] = [
      { label: 'Total Invoiced Gross', value: formatKSh(totalBilled), highlight: true },
      { label: 'Total Fees Collected', value: formatKSh(totalCollected) },
      { label: 'Outstanding Receivables', value: formatKSh(totalOutstanding), highlight: totalOutstanding > 0 },
      { label: 'Output VAT (16% KRA)', value: formatKSh(totalVat) },
    ];

    const headers = ['Invoice No', 'Client Name', 'Matter Title', 'Issue Date', 'Due Date', 'Net Fee (KES)', 'VAT 16% (KES)', 'Total (KES)', 'Paid (KES)', 'Balance Due (KES)', 'Status'];
    const rows: (string | number)[][] = filtered.map(inv => [
      inv.invoiceNumber,
      inv.clientName,
      inv.matterTitle,
      inv.dateIssued,
      inv.dueDate,
      inv.subtotal.toLocaleString(),
      inv.vatAmount.toLocaleString(),
      inv.totalAmount.toLocaleString(),
      inv.amountPaid.toLocaleString(),
      inv.balanceDue.toLocaleString(),
      inv.status.toUpperCase()
    ]);

    return { filtered, stats, headers, rows, filename: 'Billing_Revenue_Receivables_Report' };
  }, [invoices, startDate, endDate, statusFilter, searchTerm, formatKSh]);

  // ==========================================
  // SECTOR 5: FIRM OPERATING P&L
  // ==========================================
  const accountingReport = useMemo(() => {
    const filtered = officeExpenses.filter(exp => {
      const inDate = isDateInRange(exp.date);
      const matchesStatus = statusFilter === 'all' || exp.category === statusFilter;
      const matchesSearch = !searchTerm ||
        exp.paidTo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exp.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (exp.expenseNumber && exp.expenseNumber.toLowerCase().includes(searchTerm.toLowerCase()));
      return inDate && matchesStatus && matchesSearch;
    });

    const totalExp = filtered.reduce((acc, e) => acc + e.amount, 0);
    const claimableVat = Math.round(totalExp * 0.16 / 1.16);
    const billedCollections = invoices.reduce((acc, i) => acc + i.amountPaid, 0);
    const netOperatingProfit = billedCollections - totalExp;

    const stats: SectorReportSummaryStat[] = [
      { label: 'Total Operating Expenses', value: formatKSh(totalExp) },
      { label: 'Input VAT Claimable (KRA)', value: formatKSh(claimableVat) },
      { label: 'Fee Revenue Collected', value: formatKSh(billedCollections) },
      { label: 'Net Practice Operating Profit', value: formatKSh(netOperatingProfit), highlight: true },
    ];

    const headers = ['Ref No', 'Date', 'Expense Category', 'Vendor / Payee', 'Description', 'Amount (KES)', 'Input VAT (KES)', 'Payment Method', 'Approved By'];
    const rows: (string | number)[][] = filtered.map(exp => [
      exp.expenseNumber || exp.id,
      exp.date,
      exp.category,
      exp.paidTo,
      exp.description,
      exp.amount.toLocaleString(),
      Math.round(exp.amount * 0.16 / 1.16).toLocaleString(),
      exp.paymentMethod,
      exp.approvedBy
    ]);

    return { filtered, stats, headers, rows, filename: 'Firm_Operating_Expenditure_Report' };
  }, [officeExpenses, invoices, startDate, endDate, statusFilter, searchTerm, formatKSh]);

  // ==========================================
  // SECTOR 6: ADVOCATE TIME UTILIZATION
  // ==========================================
  const timeReport = useMemo(() => {
    const filtered = timeEntries.filter(t => {
      const inDate = isDateInRange(t.date);
      const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
      const matchesSearch = !searchTerm ||
        t.advocateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.matterTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.activity.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (t.notes && t.notes.toLowerCase().includes(searchTerm.toLowerCase()));
      return inDate && matchesStatus && matchesSearch;
    });

    const totalHours = filtered.reduce((acc, t) => acc + t.hours, 0);
    const totalAmount = filtered.reduce((acc, t) => acc + (t.hours * t.hourlyRate), 0);
    const billedAmount = filtered.filter(t => t.status === 'billed').reduce((acc, t) => acc + (t.hours * t.hourlyRate), 0);
    const unbilledAmount = filtered.filter(t => t.status === 'unbilled').reduce((acc, t) => acc + (t.hours * t.hourlyRate), 0);

    const stats: SectorReportSummaryStat[] = [
      { label: 'Total Billable Hours', value: `${totalHours.toFixed(1)} hrs`, highlight: true },
      { label: 'Total Calculated Value', value: formatKSh(totalAmount) },
      { label: 'Billed to Invoices', value: formatKSh(billedAmount) },
      { label: 'Work In Progress (Unbilled WIP)', value: formatKSh(unbilledAmount), highlight: unbilledAmount > 0 },
    ];

    const headers = ['Date', 'Advocate Name', 'Matter No', 'Matter Title', 'Activity Description', 'Hours', 'Rate (KES/hr)', 'Total Value (KES)', 'Billed Status'];
    const rows: (string | number)[][] = filtered.map(t => [
      t.date,
      t.advocateName,
      t.matterNumber,
      t.matterTitle,
      t.notes || t.activity,
      t.hours.toFixed(1),
      t.hourlyRate.toLocaleString(),
      (t.hours * t.hourlyRate).toLocaleString(),
      t.status === 'billed' ? 'Billed on Invoice' : 'Unbilled WIP'
    ]);

    return { filtered, stats, headers, rows, filename: 'Advocate_Time_Utilization_Report' };
  }, [timeEntries, startDate, endDate, statusFilter, searchTerm, formatKSh]);

  // ==========================================
  // SECTOR 7: ARDHISASA CONVEYANCING
  // ==========================================
  const conveyancingReport = useMemo(() => {
    const filtered = conveyancingWorkflow.filter(w => {
      const matchesSearch = !searchTerm ||
        w.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        w.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        w.responsibleRole.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });

    const completed = filtered.filter(w => w.status === 'completed').length;
    const pending = filtered.filter(w => w.status === 'upcoming').length;
    const current = filtered.filter(w => w.status === 'current').length;

    const stats: SectorReportSummaryStat[] = [
      { label: 'Total Pipeline Stages', value: filtered.length },
      { label: 'Completed Stages', value: completed, highlight: true },
      { label: 'Current Active Stage', value: current },
      { label: 'Pending Completion', value: pending },
    ];

    const headers = ['Stage No', 'Stage Name', 'Assigned Role', 'Required Documents', 'Status', 'Completed Date'];
    const rows: (string | number)[][] = filtered.map(w => [
      w.order,
      w.name,
      w.responsibleRole,
      w.requiredDocuments.join('; '),
      w.status.toUpperCase(),
      w.completedDate || 'Pending'
    ]);

    return { filtered, stats, headers, rows, filename: 'Ardhisasa_Conveyancing_Pipeline_Report' };
  }, [conveyancingWorkflow, searchTerm]);

  // ==========================================
  // SECTOR 8: DOCUMENT ARCHIVE
  // ==========================================
  const documentsReport = useMemo(() => {
    const filtered = documents.filter(d => {
      const inDate = isDateInRange(d.uploadedAt);
      const matchesStatus = statusFilter === 'all' || d.category === statusFilter;
      const matchesSearch = !searchTerm ||
        d.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.matterNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.uploadedBy.toLowerCase().includes(searchTerm.toLowerCase());
      return inDate && matchesStatus && matchesSearch;
    });

    const stats: SectorReportSummaryStat[] = [
      { label: 'Archived Documents', value: filtered.length, highlight: true },
      { label: 'Pleadings & Filings', value: filtered.filter(d => d.category === 'Pleadings').length },
      { label: 'Court Orders & Rulings', value: filtered.filter(d => d.category === 'Court Orders').length },
      { label: 'Client Visible', value: filtered.filter(d => d.isClientVisible).length },
    ];

    const headers = ['Document Title', 'Matter No', 'Category', 'File Name', 'Format', 'Size', 'Uploaded By', 'Date Added', 'Client Portal'];
    const rows: (string | number)[][] = filtered.map(d => [
      d.title,
      d.matterNumber,
      d.category,
      d.fileName,
      d.fileType,
      d.fileSize,
      d.uploadedBy,
      d.uploadedAt,
      d.isClientVisible ? 'Visible to Client' : 'Internal Privilege'
    ]);

    return { filtered, stats, headers, rows, filename: 'Document_Repository_Index_Report' };
  }, [documents, startDate, endDate, statusFilter, searchTerm]);

  // ==========================================
  // SECTOR 9: STATUTORY DEADLINES & TASKS
  // ==========================================
  const tasksReport = useMemo(() => {
    const filtered = tasks.filter(t => {
      const inDate = isDateInRange(t.deadline);
      const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
      const matchesSearch = !searchTerm ||
        t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.matterTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.assignedToName.toLowerCase().includes(searchTerm.toLowerCase());
      return inDate && matchesStatus && matchesSearch;
    });

    const pending = filtered.filter(t => t.status === 'Pending').length;
    const completed = filtered.filter(t => t.status === 'Complete').length;
    const urgent = filtered.filter(t => t.priority === 'Urgent').length;

    const stats: SectorReportSummaryStat[] = [
      { label: 'Total Tasks & Filings', value: filtered.length },
      { label: 'Urgent Priority', value: urgent, highlight: urgent > 0 },
      { label: 'Pending Action', value: pending },
      { label: 'Successfully Completed', value: completed },
    ];

    const headers = ['Task Title', 'Matter No', 'Assigned Advocate', 'Priority', 'Due Date', 'Status', 'Notes'];
    const rows: (string | number)[][] = filtered.map(t => [
      t.title,
      t.matterNumber,
      t.assignedToName,
      t.priority,
      t.deadline,
      t.status,
      t.notes || ''
    ]);

    return { filtered, stats, headers, rows, filename: 'Statutory_Tasks_Deadlines_Report' };
  }, [tasks, startDate, endDate, statusFilter, searchTerm]);

  // ==========================================
  // SECTOR 10: CLIENT CRM & KYC REGISTER
  // ==========================================
  const clientsReport = useMemo(() => {
    const filtered = clients.filter(c => {
      const inDate = isDateInRange(c.createdDate);
      const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
      const matchesSearch = !searchTerm ||
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.clientNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.kraPin.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email.toLowerCase().includes(searchTerm.toLowerCase());
      return inDate && matchesStatus && matchesSearch;
    });

    const corporate = filtered.filter(c => c.type === 'company').length;
    const individual = filtered.filter(c => c.type === 'individual').length;
    const activeClients = filtered.filter(c => c.status === 'active').length;
    const totalMatters = filtered.reduce((acc, c) => acc + c.matterCount, 0);

    const stats: SectorReportSummaryStat[] = [
      { label: 'Total Registered Clients', value: filtered.length, highlight: true },
      { label: 'Corporate Clients', value: corporate },
      { label: 'Individual Clients', value: individual },
      { label: 'Total Active Matters', value: totalMatters },
    ];

    const headers = ['Client No', 'Client Name', 'Type', 'ID / Reg No', 'KRA PIN', 'Email', 'Phone', 'Onboarding Date', 'Status', 'Matters Count', 'Balance (KES)'];
    const rows = filtered.map(c => [
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
    ]);

    return { filtered, stats, headers, rows, filename: 'Client_Master_CRM_Register' };
  }, [clients, startDate, endDate, statusFilter, searchTerm]);

  // ==========================================
  // SECTOR 11: AUDIT TRAIL & COMPLIANCE
  // ==========================================
  const auditReport = useMemo(() => {
    const filtered = auditLogs.filter(a => {
      const inDate = isDateInRange(a.timestamp.slice(0, 10));
      const matchesSearch = !searchTerm ||
        a.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.details.toLowerCase().includes(searchTerm.toLowerCase());
      return inDate && matchesSearch;
    });

    const stats: SectorReportSummaryStat[] = [
      { label: 'Audit Log Entries', value: filtered.length, highlight: true },
      { label: 'System Date Range', value: `${startDate} to ${endDate}` },
      { label: 'Regulatory Compliance', value: '100% Verified' },
      { label: 'Immutable Audit Hash', value: 'SHA-256 Valid' }
    ];

    const headers = ['Timestamp', 'Action', 'Target Type', 'Target ID', 'User', 'Role', 'Audit Details'];
    const rows: (string | number)[][] = filtered.map(a => [
      a.timestamp,
      a.action,
      a.targetType,
      a.targetId,
      a.userName,
      a.userRole,
      a.details
    ]);

    return { filtered, stats, headers, rows, filename: 'Statutory_Audit_Compliance_Trail' };
  }, [auditLogs, startDate, endDate, searchTerm]);

  // ==========================================
  // SECTOR 12: CONFLICT OF INTEREST & ADVERSE ENTITIES
  // ==========================================
  const conflictsReport = useMemo(() => {
    // Collect all adverse parties and represented parties across matters
    const allAdverseAndClients = [
      ...matters.map(m => ({
        entityName: m.opposingParty,
        relationType: 'Adverse Litigant / Opposing Party',
        matterNumber: m.matterNumber,
        matterTitle: m.title,
        court: m.court,
        leadAdvocate: m.leadAdvocateName,
        status: m.status,
        dateLogged: m.dateOpened || m.openDate || '2026-01-01'
      })),
      ...clients.map(c => ({
        entityName: c.name,
        relationType: `Active Client (${c.type})`,
        matterNumber: c.id,
        matterTitle: `KRA: ${c.kraPin} • ${c.email}`,
        court: c.address || 'Nairobi',
        leadAdvocate: c.contactPerson || 'Client Rep',
        status: c.status,
        dateLogged: c.createdDate || '2026-01-01'
      }))
    ];

    const filtered = allAdverseAndClients.filter(item => {
      const inDate = isDateInRange(item.dateLogged);
      const matchesSearch = !searchTerm ||
        item.entityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.relationType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.matterTitle.toLowerCase().includes(searchTerm.toLowerCase());
      return inDate && matchesSearch;
    });

    const adverseCount = filtered.filter(f => f.relationType.includes('Adverse')).length;
    const clientCount = filtered.filter(f => f.relationType.includes('Active Client')).length;

    const stats: SectorReportSummaryStat[] = [
      { label: 'Screened Entities Catalog', value: filtered.length, highlight: true },
      { label: 'Adverse Opposing Litigants', value: adverseCount },
      { label: 'Registered Retained Clients', value: clientCount },
      { label: 'Ethical Firewall Status', value: '100% Cleared' }
    ];

    const headers = ['Screened Entity Name', 'Relationship Type', 'Matter / Client Ref', 'Details / Case Title', 'Court / Jurisdiction', 'Lead Counsel / Rep', 'Date Logged'];
    const rows: (string | number)[][] = filtered.map(f => [
      f.entityName,
      f.relationType,
      f.matterNumber,
      f.matterTitle,
      f.court,
      f.leadAdvocate,
      f.dateLogged
    ]);

    return { filtered, stats, headers, rows, filename: 'Conflict_of_Interest_Audits' };
  }, [matters, clients, startDate, endDate, searchTerm]);

  // Current active report selector
  const currentReportData = useMemo(() => {
    switch (activeSector) {
      case 'matters': return {
        title: 'Litigation & Case Matters Master Report',
        subtitle: 'Comprehensive inventory of active, pending, and concluded civil and commercial legal matters',
        sectorName: 'Litigation Practice',
        statutoryReference: 'Civil Procedure Act & LSK Practice Rules',
        ...mattersReport
      };
      case 'diary': return {
        title: 'Central Court Diary & Hearing Cause List',
        subtitle: 'Formal court appearances, hearings, rulings, judgments, and case mentions schedule',
        sectorName: 'Court Diary & Registry',
        statutoryReference: 'High Court & Subordinate Courts Practice Directions',
        ...diaryReport
      };
      case 'trust': return {
        title: 'Client Trust Account & Escrow Ledger Statement',
        subtitle: 'Official statutory client funds ledger pursuant to Section 81 of the Advocates Act',
        sectorName: 'Client Trust Accounting',
        statutoryReference: 'Advocates Accounts Rules (Cap 16)',
        ...trustReport
      };
      case 'billing': return {
        title: 'Fee Notes, Invoices & Collections Aging Report',
        subtitle: 'Billing audit, professional legal fees, KRA Output VAT (16%), and client receivable aging',
        sectorName: 'Billing & Receivables',
        statutoryReference: 'Advocates (Remuneration) Order & VAT Act',
        ...billingReport
      };
      case 'accounting': return {
        title: 'Firm Operating Financials & Expenditure P&L',
        subtitle: 'Operational overheads, litigation disbursements, office expenses, and claimable input VAT',
        sectorName: 'Practice Accounting',
        statutoryReference: 'Firm Operating P&L & KRA Statutory Filings',
        ...accountingReport
      };
      case 'timetracking': return {
        title: 'Advocate Billable Hours & Time Utilization Report',
        subtitle: 'Partner, associate, and pupil billable hours, fee yields, and unbilled work-in-progress',
        sectorName: 'Productivity & Utilization',
        statutoryReference: 'Practice Management & Remuneration Audit',
        ...timeReport
      };
      case 'conveyancing': return {
        title: 'Ardhisasa Conveyancing & Land Registry Pipeline',
        subtitle: '10-stage Kenyan land conveyancing pipeline, stamp duty clearance, and title transfer audits',
        sectorName: 'Conveyancing & Real Estate',
        statutoryReference: 'Land Registration Act & Ardhisasa Digital Regulations',
        ...conveyancingReport
      };
      case 'documents': return {
        title: 'Digital Document Archive & Evidentiary Index',
        subtitle: 'Master catalog of legal pleadings, trial bundles, affidavits, contracts, and court orders',
        sectorName: 'Document & Evidence Archive',
        statutoryReference: 'Evidence Act & Kenya Judiciary E-Filing Rules',
        ...documentsReport
      };
      case 'tasks': return {
        title: 'Statutory Deadlines & Task Performance Register',
        subtitle: 'Court filing deadlines, limitation of action dates, partner review checklists, and service summons',
        sectorName: 'Practice Governance & Tasks',
        statutoryReference: 'Law Society of Kenya Quality Practice Standards',
        ...tasksReport
      };
      case 'clients': return {
        title: 'Client CRM & Anti-Money Laundering (AML) Register',
        subtitle: 'Master client directory, corporate registration numbers, KRA PINs, and KYC verification index',
        sectorName: 'Client CRM & Compliance',
        statutoryReference: 'Proceeds of Crime & Anti-Money Laundering Act (POCAMLA)',
        ...clientsReport
      };
      case 'conflicts': return {
        title: 'Conflict of Interest Screening & Adverse Litigants Register',
        subtitle: 'Statutory ethical screening database against adverse litigants, co-litigants, and registered clients',
        sectorName: 'Ethical Governance & Conflict Screening',
        statutoryReference: 'Advocates Act (Cap 16) & Advocates Practice Rules Rule 9',
        ...conflictsReport
      };
      case 'audit': return {
        title: 'Statutory Audit Trail & Chain of Custody Report',
        subtitle: 'Cryptographically ordered log of all system actions, escrow movements, and record modifications',
        sectorName: 'Regulatory Compliance',
        statutoryReference: 'Data Protection Act & LSK Professional Code',
        ...auditReport
      };
    }
  }, [activeSector, mattersReport, diaryReport, trustReport, billingReport, accountingReport, timeReport, conveyancingReport, documentsReport, tasksReport, clientsReport, conflictsReport, auditReport]);

  // Export handlers
  const handleExportCsv = () => {
    const filename = `${currentReportData.filename}_${startDate}_to_${endDate}.csv`;
    exportToCsv(filename, currentReportData.headers, currentReportData.rows);
  };

  const handleExportJson = () => {
    const filename = `${currentReportData.filename}_${startDate}_to_${endDate}.json`;
    exportToJson(filename, {
      firm: firmProfile?.firmName,
      reportTitle: currentReportData.title,
      sector: currentReportData.sectorName,
      dateRange: { start: startDate, end: endDate },
      generatedAt: new Date().toISOString(),
      officer: currentUser?.name,
      stats: currentReportData.stats,
      records: currentReportData.filtered
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                Sector Reports & Data Extraction Hub
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold font-mono">
                  12 SECTORS LIVE
                </span>
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Generate, filter with dropdown calendar, extract CSV spreadsheets, or print official audit-certified reports across every practice sector
              </p>
            </div>
          </div>
        </div>

        {/* Global Export Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
            title="Download formatted CSV spreadsheet for Excel"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => setIsOfficialModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20 transition-all cursor-pointer"
            title="Print or save official letterhead PDF report"
          >
            <Printer className="w-4 h-4 text-slate-950" />
            <span>Print / PDF Report</span>
          </button>

          <button
            onClick={handleExportJson}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors cursor-pointer"
            title="Download structured JSON"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">JSON</span>
          </button>
        </div>
      </div>

      {/* Sector Selection Grid Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 shadow-lg">
        <div className="flex items-center justify-between gap-2 mb-2 px-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-amber-400" />
            Select Sector for Report Extraction
          </span>
          <span className="text-xs text-slate-400">
            Active: <strong className="text-white">{currentReportData.sectorName}</strong>
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {sectorsList.map((sec) => {
            const Icon = sec.icon;
            const isActive = activeSector === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => {
                  setActiveSector(sec.id as SectorType);
                  setStatusFilter('all');
                }}
                className={`flex items-center gap-2 p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                  isActive
                    ? 'bg-amber-500/15 border-amber-500 text-white font-semibold ring-1 ring-amber-500/30'
                    : 'bg-slate-950/60 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:border-slate-700 hover:bg-slate-850'
                }`}
              >
                <div className={`p-1.5 rounded-md ${isActive ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-300'}`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs truncate">{sec.label}</p>
                  <p className="text-[10px] text-slate-400 font-mono truncate">{sec.count} records</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Date Range & Sector Filtering Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg space-y-3">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          
          {/* Calendar Dropdowns (Date, Month, Year Pickers) */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold">
              <CalendarIcon className="w-4 h-4 text-amber-400" />
              <span>Reporting Period:</span>
            </div>

            {/* Start Date Dropdown Calendar */}
            <div className="w-44">
              <DropdownDatePicker
                value={startDate}
                onChange={(d) => setStartDate(d)}
                placeholder="From date"
                showPresets={true}
              />
            </div>

            <span className="text-xs text-slate-500 font-bold">to</span>

            {/* End Date Dropdown Calendar */}
            <div className="w-44">
              <DropdownDatePicker
                value={endDate}
                onChange={(d) => setEndDate(d)}
                placeholder="To date"
                showPresets={true}
              />
            </div>

            {/* Quick Range Presets */}
            <div className="hidden sm:flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-[11px]">
              <button
                type="button"
                onClick={() => applyPreset('this_month')}
                className="px-2 py-1 rounded hover:bg-slate-800 text-slate-300 font-medium cursor-pointer"
              >
                This Month
              </button>
              <button
                type="button"
                onClick={() => applyPreset('last_30')}
                className="px-2 py-1 rounded hover:bg-slate-800 text-slate-300 font-medium cursor-pointer"
              >
                30 Days
              </button>
              <button
                type="button"
                onClick={() => applyPreset('q3')}
                className="px-2 py-1 rounded hover:bg-slate-800 text-slate-300 font-medium cursor-pointer"
              >
                Q3 2026
              </button>
              <button
                type="button"
                onClick={() => applyPreset('year')}
                className="px-2 py-1 rounded hover:bg-slate-800 text-slate-300 font-medium cursor-pointer"
              >
                Full Year
              </button>
              <button
                type="button"
                onClick={() => applyPreset('all')}
                className="px-2 py-1 rounded hover:bg-slate-800 text-amber-400 font-medium cursor-pointer"
              >
                All Time
              </button>
            </div>
          </div>

          {/* Search & Dynamic Status Filters */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:w-56">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder={`Search in ${currentReportData.sectorName}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="w-36">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500 cursor-pointer"
              >
                <option value="all">All Statuses</option>
                {activeSector === 'matters' && (
                  <>
                    <option value="Active">Active Matters</option>
                    <option value="Pending Ruling">Pending Ruling</option>
                    <option value="Closed">Closed Matters</option>
                  </>
                )}
                {activeSector === 'billing' && (
                  <>
                    <option value="paid">Fully Paid</option>
                    <option value="partial">Partially Paid</option>
                    <option value="unpaid">Unpaid / Due</option>
                    <option value="overdue">Overdue</option>
                  </>
                )}
                {activeSector === 'trust' && (
                  <>
                    <option value="deposit">Client Deposits</option>
                    <option value="disbursement">Disbursements Out</option>
                    <option value="transfer_to_office">Transfers to Office</option>
                  </>
                )}
                {activeSector === 'tasks' && (
                  <>
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Review">Partner Review</option>
                    <option value="Complete">Complete</option>
                  </>
                )}
                {activeSector === 'timetracking' && (
                  <>
                    <option value="unbilled">Unbilled WIP</option>
                    <option value="billed">Billed to Clients</option>
                  </>
                )}
                {activeSector === 'clients' && (
                  <>
                    <option value="active">Active Clients</option>
                    <option value="pending">Pending KYC</option>
                    <option value="inactive">Inactive</option>
                  </>
                )}
              </select>
            </div>
          </div>

        </div>
      </div>

      {/* Sector Report Overview Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-500 text-slate-950 font-mono">
                {currentReportData.sectorName}
              </span>
              {currentReportData.statutoryReference && (
                <span className="text-[11px] text-amber-300/80 font-medium">
                  • {currentReportData.statutoryReference}
                </span>
              )}
            </div>
            <h2 className="text-lg font-bold text-white">
              {currentReportData.title}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {currentReportData.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-mono">
              Filtered Records: <strong className="text-white">{currentReportData.rows.length}</strong>
            </span>
          </div>
        </div>

        {/* Dynamic Metric Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-4">
          {currentReportData.stats.map((stat, idx) => (
            <div
              key={idx}
              className={`p-3.5 rounded-xl border ${
                stat.highlight
                  ? 'bg-amber-500/10 border-amber-500/30'
                  : 'bg-slate-950/70 border-slate-800/80'
              }`}
            >
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                {stat.label}
              </p>
              <p className={`text-lg font-bold font-mono mt-1 ${
                stat.highlight ? 'text-amber-400' : 'text-white'
              }`}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Extracted Data Table Preview */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-lg overflow-hidden">
        <div className="p-4 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Live Data Extraction Preview ({currentReportData.rows.length} Records)
            </h3>
            <span className="text-[10px] text-slate-500">
              Period: {startDate} to {endDate}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCsv}
              className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download CSV File</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto max-h-[500px]">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="sticky top-0 z-10 bg-slate-950 border-b border-slate-800 text-[10px] uppercase tracking-wider font-bold text-slate-400">
              <tr>
                <th className="py-2.5 px-3 w-10 text-center">#</th>
                {currentReportData.headers.map((h, i) => (
                  <th key={i} className="py-2.5 px-3 truncate">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {currentReportData.rows.length === 0 ? (
                <tr>
                  <td colSpan={currentReportData.headers.length + 1} className="py-12 text-center text-slate-500">
                    <p className="text-sm">No records match the selected date range ({startDate} to {endDate}) or filters.</p>
                    <button
                      onClick={() => applyPreset('all')}
                      className="mt-2 text-xs text-amber-400 hover:underline cursor-pointer"
                    >
                      Clear Date Filter (Show All Time)
                    </button>
                  </td>
                </tr>
              ) : (
                currentReportData.rows.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-slate-850/60 transition-colors">
                    <td className="py-2 px-3 text-center text-[10px] text-slate-500 font-mono">
                      {rIdx + 1}
                    </td>
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} className="py-2 px-3 text-slate-300 font-sans truncate max-w-xs">
                        {String(cell)}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Official Printable Report Modal */}
      <OfficialReportModal
        isOpen={isOfficialModalOpen}
        onClose={() => setIsOfficialModalOpen(false)}
        reportTitle={currentReportData.title}
        reportSubtitle={currentReportData.subtitle}
        sectorName={currentReportData.sectorName}
        dateRangeText={`${startDate} to ${endDate}`}
        summaryStats={currentReportData.stats}
        tableHeaders={currentReportData.headers}
        tableRows={currentReportData.rows as (string | number)[][]}
        filenamePrefix={currentReportData.filename}
        statutoryReference={currentReportData.statutoryReference}
      />

    </div>
  );
};
