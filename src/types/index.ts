export type UserRole = 
  | 'managing_partner'
  | 'partner'
  | 'associate'
  | 'clerk'
  | 'accounts'
  | 'client';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  barNumber?: string;
  phone: string;
  avatar: string;
  title: string;
}

export type ClientType = 'individual' | 'company' | 'institution';
export type ClientStatus = 'active' | 'inactive' | 'prospective' | 'closed';

export interface Client {
  id: string;
  clientNumber: string;
  name: string;
  type: ClientType;
  contactPerson?: string;
  email: string;
  phone: string;
  address: string;
  idOrRegNumber: string; // ID / Passport / Company Reg No.
  kraPin: string; // Tax PIN (e.g. P051234567Z)
  status: ClientStatus;
  portalAccess: boolean;
  matterCount: number;
  outstandingBalance: number;
  createdDate: string;
  notes?: string;
}

export type MatterCategory = 
  | 'Civil litigation'
  | 'Criminal'
  | 'Family'
  | 'Conveyancing'
  | 'Commercial'
  | 'Employment'
  | 'Land'
  | 'Succession'
  | 'Corporate'
  | 'Constitutional'
  | 'Debt recovery'
  | 'Insurance'
  | 'Probate'
  | 'Intellectual property';

export type MatterStatus = 
  | 'Active'
  | 'Pending Ruling'
  | 'Discovery'
  | 'Pleadings'
  | 'Hearing Scheduled'
  | 'In Conveyancing'
  | 'Judgement Delivered'
  | 'Closed';

export type MatterPriority = 'Urgent' | 'High' | 'Medium' | 'Normal';

export interface Matter {
  id: string;
  matterNumber: string; // e.g. LF/2026/042
  clientId: string;
  clientName: string;
  title: string;
  category: MatterCategory;
  court: string; // e.g. Milimani Commercial Courts, Employment and Labour Relations Court
  caseNumber: string; // e.g. HCCC No. E284 of 2026
  opposingParty: string;
  opposingAdvocate: string;
  leadAdvocateId: string;
  leadAdvocateName: string;
  assignedClerkId: string;
  assignedClerkName: string;
  dateOpened: string;
  openDate?: string;
  assignedAdvocate?: string;
  budget?: number;
  billedAmount?: number;
  status: MatterStatus;
  priority: MatterPriority;
  estimatedValue: number; // in KSh
  nextAction: string;
  nextDeadline: string;
  workflowStage?: string;
  notes?: string;
}

export type CourtEventType = 
  | 'Mention'
  | 'Hearing'
  | 'Ruling'
  | 'Judgement'
  | 'Filing Deadline'
  | 'Statutory Deadline'
  | 'Pre-Trial Conference'
  | 'Client Meeting'
  | 'Advocate Appointment';

export interface CourtEvent {
  id: string;
  matterId: string;
  matterNumber: string;
  matterTitle: string;
  eventType: CourtEventType;
  court: string;
  courtRoom?: string;
  room?: string;
  judgeName?: string;
  virtualLink?: string;
  date: string; // YYYY-MM-DD
  time: string; // e.g. 09:00 AM
  advocateAssigned: string;
  status: 'Upcoming' | 'Completed' | 'Adjourned';
  notes?: string;
  reminderDays: number[]; // e.g. [30, 14, 7, 3, 1, 0]
}

export type DocumentCategory = 
  | 'Pleadings'
  | 'Evidence'
  | 'Court Orders'
  | 'Correspondence'
  | 'Billing'
  | 'Conveyancing Deeds'
  | 'Legal Opinions';

export interface LegalDocument {
  id: string;
  matterId: string;
  matterNumber: string;
  title: string;
  fileName: string;
  category: DocumentCategory;
  version: string;
  uploadedBy: string;
  uploadedAt: string;
  uploadedDate?: string;
  fileSize: string;
  fileType: string;
  tags: string[];
  isClientVisible: boolean;
  contentSnippet?: string;
}

export type TaskStatus = 'Pending' | 'In Progress' | 'Review' | 'Complete';
export type TaskPriority = 'Urgent' | 'High' | 'Medium' | 'Normal';

export interface Task {
  id: string;
  matterId: string;
  matterNumber: string;
  matterTitle: string;
  title: string;
  assignedToId: string;
  assignedToName: string;
  assignedRole: string;
  deadline: string;
  dueDate?: string;
  priority: TaskPriority;
  status: TaskStatus;
  completedAt?: string;
  notes?: string;
  description?: string;
}

export interface WorkflowStage {
  id: string;
  order: number;
  stageNumber?: number;
  name: string;
  stageName?: string;
  description: string;
  status: 'completed' | 'current' | 'upcoming';
  responsibleRole: string;
  assignedRole?: string;
  completedDate?: string;
  requiredDocuments: string[];
  requirements?: string[];
  estimatedDays?: number;
}

export interface MatterWorkflow {
  matterId: string;
  workflowType: 'Conveyancing' | 'Civil Litigation' | 'Debt Recovery';
  stages: WorkflowStage[];
}

export interface FeeItem {
  id: string;
  description: string;
  type: 'professional_fee' | 'court_fee' | 'search_fee' | 'disbursement' | 'drafting' | 'attendance';
  amount: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string; // e.g. INV-2026-089
  matterId: string;
  matterNumber: string;
  matterTitle: string;
  clientId: string;
  clientName: string;
  clientAddress: string;
  clientPin: string;
  dateIssued: string;
  issueDate?: string;
  dueDate: string;
  status: 'Draft' | 'Sent' | 'Paid' | 'Partially Paid' | 'Overdue';
  items: FeeItem[];
  subtotal: number;
  applyVat: boolean;
  vatRate: number; // e.g. 16%
  vatAmount: number;
  taxAmount?: number;
  totalAmount: number;
  amountPaid: number;
  paidAmount?: number;
  balanceDue: number;
  notes?: string;
}

export interface PaymentReceipt {
  id: string;
  receiptNumber: string;
  invoiceId: string;
  invoiceNumber: string;
  matterId: string;
  clientName: string;
  amount: number;
  paymentMethod: 'M-Pesa Paybill' | 'RTGS / Bank Wire' | 'Cheque' | 'Direct Deposit';
  referenceNumber: string;
  date: string;
  accountType: 'office' | 'trust';
  receivedBy: string;
}

export interface TrustTransaction {
  id: string;
  transactionNumber: string; // e.g. TR-2026-0045
  voucherNumber?: string;
  matterId: string;
  matterNumber: string;
  matterTitle: string;
  clientId: string;
  clientName: string;
  type: 'deposit_received' | 'client_disbursement' | 'transfer_to_office';
  amount: number;
  sourceOrPayee: string;
  purpose: string; // e.g. "10% Conveyancing deposit for LR 209/1450"
  description?: string;
  date: string;
  verifiedByPartner: string;
  supportingDocRef?: string;
  paymentMethod?: string;
  bankAccount?: string;
  balanceAfter: number;
  runningBalance?: number;
}

export interface OfficeExpense {
  id: string;
  expenseNumber: string;
  referenceNumber?: string;
  category: 'Rent & Utilities' | 'Salaries' | 'Court Filing Fees' | 'Library & Subscriptions' | 'IT & Software' | 'Office Administration' | 'Marketing';
  description: string;
  amount: number;
  vatAmount?: number;
  date: string;
  paidTo: string;
  vendor?: string;
  paymentMethod: string;
  approvedBy: string;
}

export interface TimeEntry {
  id: string;
  matterId: string;
  matterNumber: string;
  matterTitle: string;
  advocateId: string;
  advocateName: string;
  userName?: string;
  activity: 'Legal Research' | 'Drafting Pleadings' | 'Court Attendance' | 'Client Meeting' | 'Consultation' | 'Registry Filing';
  description?: string;
  hours: number;
  durationHours?: number;
  hourlyRate: number; // in KSh
  billable: boolean;
  totalAmount?: number;
  date: string;
  status: 'unbilled' | 'billed';
  billed?: boolean;
  notes?: string;
}

export interface CommunicationLog {
  id: string;
  matterId: string;
  matterNumber: string;
  matterTitle: string;
  type: 'Email' | 'Phone Call' | 'WhatsApp' | 'Client Meeting' | 'Registry Notice';
  date: string;
  time: string;
  sender: string;
  recipient: string;
  summary: string;
  actionRequired?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userName: string;
  userRole: string;
  action: string;
  targetType: string;
  entityType?: string;
  targetId: string;
  entityId?: string;
  ipAddress?: string;
  details: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'urgent' | 'warning' | 'info';
  timestamp: string;
  matterId?: string;
  linkTab?: string;
  read: boolean;
}

// Deployment and Reset System Types
export type DeploymentEnvironment = 'production' | 'staging' | 'demo' | 'fresh_deploy';

export interface FirmDeploymentProfile {
  firmName: string;
  lskFirmNumber: string;
  lskRegistrationNo?: string;
  officeAddress?: string;
  billingEmail?: string;
  kraPin: string;
  managingPartner: string;
  primaryPractice: string;
  currency: string;
  vatRate: number;
  ardhisasaEnabled: boolean;
  efilingEnabled: boolean;
  trustBankName: string;
  trustAccountNumber: string;
  officeBankName: string;
  officeAccountNumber: string;
  environment: DeploymentEnvironment;
  lastDeployedAt: string;
  version: string;
  buildNumber: string;
}

export type DeploymentTemplateId = 
  | 'clean_production'
  | 'standard_kenya'
  | 'commercial_boutique'
  | 'conveyancing_property'
  | 'high_volume_litigation';

export interface ResetScope {
  clients: boolean;
  matters: boolean;
  courtDiary: boolean;
  documents: boolean;
  tasks: boolean;
  invoicesAndReceipts: boolean;
  trustLedger: boolean;
  officeExpenses: boolean;
  timeEntries: boolean;
  communications: boolean;
  workflowProgress: boolean;
  auditLogs: boolean;
}

export interface SystemSnapshot {
  id: string;
  name: string;
  timestamp: string;
  environment: DeploymentEnvironment;
  description: string;
  autoCreated: boolean;
  recordCounts: {
    clients: number;
    matters: number;
    courtEvents: number;
    documents: number;
    tasks: number;
    invoices: number;
    receipts: number;
    trustTransactions: number;
    officeExpenses: number;
    timeEntries: number;
    communications: number;
    auditLogs: number;
  };
  dataPayload: {
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
    conveyancingWorkflow: WorkflowStage[];
    auditLogs: AuditLog[];
    profile?: FirmDeploymentProfile;
  };
}

export interface SystemIntegrityReport {
  timestamp: string;
  trustAccountReconciled: boolean;
  trustLedgerTotal: number;
  clientBalancesTotal: number;
  trustDiscrepancy: number;
  orphanMattersCount: number;
  courtEventsWithoutAdvocateCount: number;
  unbilledHoursCount: number;
  unbilledHoursValue: number;
  totalStorageEstimateKb: number;
  checksPassed: number;
  totalChecks: number;
  healthScore: number;
  issues: Array<{
    severity: 'critical' | 'warning' | 'info';
    category: string;
    message: string;
  }>;
}
