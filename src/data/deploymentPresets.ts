import {
  FirmDeploymentProfile,
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
  WorkflowStage,
  AuditLog
} from '../types';
import {
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
} from './mockData';

export const DEFAULT_FIRM_PROFILE: FirmDeploymentProfile = {
  firmName: 'LexisFirm Advocates & Legal Consultants LLP',
  lskFirmNumber: 'LSK/FIRM/2018/0942',
  kraPin: 'P051892341Z',
  managingPartner: 'Phosta Colliner, SC',
  primaryPractice: 'Full-Service Commercial, Litigation & Conveyancing',
  currency: 'KSh',
  vatRate: 16,
  ardhisasaEnabled: true,
  efilingEnabled: true,
  trustBankName: 'NCBA Bank Kenya PLC (Upper Hill Branch)',
  trustAccountNumber: '082-10928374-001',
  officeBankName: 'Standard Chartered Bank Kenya (Kenyatta Ave Branch)',
  officeAccountNumber: '010-82736450-001',
  environment: 'demo',
  lastDeployedAt: '2026-09-28T09:00:00Z',
  version: '2.6.4-prod',
  buildNumber: 'LFMS-BUILD-20260928-01'
};

// 1. Commercial & Corporate Boutique Dataset
const COMMERCIAL_CLIENTS: Client[] = [
  {
    id: 'c-cb1',
    clientNumber: 'CL-2026-010',
    name: 'Savannah FinTech Ventures Limited',
    type: 'company',
    contactPerson: 'David Mutua (Chief Investment Officer)',
    email: 'dmutua@savannahfintech.co',
    phone: '+254 720 999 888',
    address: '9th Floor, Delta Corner Tower, Westlands, Nairobi',
    idOrRegNumber: 'CPR/2021/89410',
    kraPin: 'P051992211A',
    status: 'active',
    portalAccess: true,
    matterCount: 2,
    outstandingBalance: 350000,
    createdDate: '2026-02-10',
    notes: 'Series B tech fund specializing in East African cross-border payment rails.'
  },
  {
    id: 'c-cb2',
    clientNumber: 'CL-2026-011',
    name: 'Equator Renewable Power PLC',
    type: 'institution',
    contactPerson: 'Eng. Beatrice Ndunge',
    email: 'b.ndunge@equatorpower.ke',
    phone: '+254 733 112 233',
    address: 'Solar House, Kilimani Business Park, Nairobi',
    idOrRegNumber: 'PUB/2019/3321',
    kraPin: 'P051664422B',
    status: 'active',
    portalAccess: true,
    matterCount: 1,
    outstandingBalance: 600000,
    createdDate: '2026-04-15'
  }
];

const COMMERCIAL_MATTERS: Matter[] = [
  {
    id: 'm-cb1',
    matterNumber: 'LF/2026/055',
    clientId: 'c-cb1',
    clientName: 'Savannah FinTech Ventures Limited',
    title: 'Series B Cross-Border Acquisition & Regulatory Clearance (Central Bank of Kenya)',
    category: 'Corporate',
    court: 'Central Bank of Kenya & Competition Authority',
    caseNumber: 'CAK/M&A/2026/044',
    opposingParty: 'N/A (Regulatory Filing)',
    opposingAdvocate: 'In-House Counsel, Competition Authority',
    leadAdvocateId: 'u-1',
    leadAdvocateName: 'Phosta Colliner, SC',
    assignedClerkId: 'u-5',
    assignedClerkName: 'Brian Kipkemboi',
    dateOpened: '2026-03-01',
    status: 'Active',
    priority: 'Urgent',
    estimatedValue: 240000000,
    nextAction: 'Lodge merger notification with COMESA Competition Commission',
    nextDeadline: '2026-10-12',
    notes: 'Advising on USD 2.1M acquisition of regional payment gateway.'
  },
  {
    id: 'm-cb2',
    matterNumber: 'LF/2026/056',
    clientId: 'c-cb2',
    clientName: 'Equator Renewable Power PLC',
    title: 'Equator Power v. Commissioner of Domestic Taxes (Tax Appeals Tribunal)',
    category: 'Commercial',
    court: 'Tax Appeals Tribunal (TAT), Nairobi',
    caseNumber: 'TAT Appeal No. E112 of 2026',
    opposingParty: 'Commissioner of Domestic Taxes (KRA)',
    opposingAdvocate: 'KRA Legal Services Department',
    leadAdvocateId: 'u-2',
    leadAdvocateName: 'Jane Wanjiku Kamau',
    assignedClerkId: 'u-5',
    assignedClerkName: 'Brian Kipkemboi',
    dateOpened: '2026-05-18',
    status: 'Hearing Scheduled',
    priority: 'High',
    estimatedValue: 48000000,
    nextAction: 'File written submissions on Section 15 corporate tax deductions',
    nextDeadline: '2026-10-08',
    notes: 'Challenging withholding tax assessment on solar EPC contracts.'
  }
];

// 2. High-Volume Litigation Cause List Dataset
const LITIGATION_CAUSE_LIST_EVENTS: CourtEvent[] = [
  {
    id: 'ce-lit1',
    matterId: 'm-1',
    matterNumber: 'LF/2026/038',
    matterTitle: 'ABC Limited v. Wasilwa & 4 Others',
    eventType: 'Hearing',
    court: 'Employment and Labour Relations Court (ELRC), Milimani',
    courtRoom: 'Court No. 3 (Ground Floor)',
    judgeName: 'Hon. Lady Justice M. Nduma Nderi',
    date: '2026-09-29',
    time: '09:00 AM',
    advocateAssigned: 'Phosta Colliner, SC',
    status: 'Upcoming',
    notes: 'Substantive hearing of Respondent application to strike out witness statements. Client CEO attending.',
    reminderDays: [14, 7, 3, 1, 0]
  },
  {
    id: 'ce-lit2',
    matterId: 'm-3',
    matterNumber: 'LF/2026/041',
    matterTitle: 'Florence Muthoni v. St. Jude Hospital Ltd',
    eventType: 'Ruling',
    court: 'High Court of Kenya (Civil Division), Milimani',
    courtRoom: 'Court No. 7, 3rd Floor',
    judgeName: 'Hon. Mr. Justice A. Mabeya',
    date: '2026-10-02',
    time: '10:30 AM',
    advocateAssigned: 'David Kiprop Cheruiyot',
    status: 'Upcoming',
    notes: 'Ruling on production of hospital medical board audit logs.',
    reminderDays: [7, 3, 1, 0]
  },
  {
    id: 'ce-lit3',
    matterId: 'm-4',
    matterNumber: 'LF/2026/044',
    matterTitle: 'Rift Valley Agribusiness Ltd v. Apex Milling Ltd',
    eventType: 'Mention',
    court: 'Milimani Commercial Courts',
    courtRoom: 'Virtual Courtroom Link 04',
    judgeName: 'Hon. Lady Justice J. Kamau',
    date: '2026-10-05',
    time: '09:30 AM',
    advocateAssigned: 'Jane Wanjiku Kamau',
    status: 'Upcoming',
    notes: 'Pre-trial directions and confirmation of witness statements exchange.',
    reminderDays: [7, 3, 1, 0]
  },
  {
    id: 'ce-lit4',
    matterId: 'm-2',
    matterNumber: 'LF/2026/039',
    matterTitle: 'Kariuki v. National Land Commission & Kenya Railways',
    eventType: 'Hearing',
    court: 'Environment and Land Court (ELC), Nairobi',
    courtRoom: 'Court No. 2, Milimani Law Courts',
    judgeName: 'Hon. Mr. Justice O. Angote',
    date: '2026-10-09',
    time: '09:00 AM',
    advocateAssigned: 'Phosta Colliner, SC',
    status: 'Upcoming',
    notes: 'Cross-examination of NLC Chief Valuer on compulsory acquisition award.',
    reminderDays: [14, 7, 3, 1, 0]
  },
  {
    id: 'ce-lit5',
    matterId: 'm-5',
    matterNumber: 'LF/2026/047',
    matterTitle: 'Estate of Late Wilson Gichuru (Probate & Administration)',
    eventType: 'Pre-Trial Conference',
    court: 'High Court Family Division, Milimani',
    courtRoom: 'Chambers 14, 1st Floor',
    judgeName: 'Hon. Lady Justice M. Muigai',
    date: '2026-10-14',
    time: '11:00 AM',
    advocateAssigned: 'Faith Akinyi Otieno',
    status: 'Upcoming',
    notes: 'Mediation agreement confirmation between surviving heirs.',
    reminderDays: [7, 3, 1, 0]
  }
];

export interface DeploymentPresetDefinition {
  id: string;
  name: string;
  badge: string;
  description: string;
  environmentTarget: 'production' | 'staging' | 'demo';
  stats: {
    clients: number;
    matters: number;
    courtEvents: number;
    invoices: number;
  };
  recommendedFor: string;
  data: {
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
  };
}

export const DEPLOYMENT_TEMPLATES: DeploymentPresetDefinition[] = [
  {
    id: 'clean_production',
    name: 'Production Clean Slate (Bare Firm Instance)',
    badge: 'Production Ready',
    description: 'Deploys a pristine, production-grade law firm database. Clears all demo clients, test cases, mock invoices, and sample trust records, while safely retaining firm advocates, partners, LSK chart of accounts, standard court lists, and 10-step conveyancing templates.',
    environmentTarget: 'production',
    stats: {
      clients: 0,
      matters: 0,
      courtEvents: 0,
      invoices: 0
    },
    recommendedFor: 'Going live with real clients, new branch provisioning, or partner production rollout.',
    data: {
      clients: [],
      matters: [],
      courtEvents: [],
      documents: [],
      tasks: [],
      invoices: [],
      receipts: [],
      trustTransactions: [],
      officeExpenses: [],
      timeEntries: [],
      communications: [],
      conveyancingWorkflow: INITIAL_CONVEYANCING_WORKFLOW.map(s => ({
        ...s,
        status: s.order === 1 ? 'current' : 'upcoming',
        completedDate: undefined
      })),
      auditLogs: [
        {
          id: `audit-prod-${Date.now()}`,
          timestamp: new Date().toISOString(),
          userName: 'System Architect / Managing Partner',
          userRole: 'Managing Partner',
          action: 'DEPLOY_PRODUCTION_INSTANCE',
          targetType: 'SYSTEM_DATABASE',
          targetId: 'LEXISFIRM_PROD_CORE',
          details: 'Initialized Clean Production Slate. All demo entities purged per Bar governance compliance.'
        }
      ]
    }
  },
  {
    id: 'standard_kenya',
    name: 'Standard Kenyan Practice (Full Benchmark)',
    badge: 'Comprehensive Demo',
    description: 'The standard multi-disciplinary law firm setup featuring 6 comprehensive matters across Commercial Litigation, Employment (ELRC), Ardhisasa Conveyancing, Constitutional Petition, and Probate Succession, with active trust balances and billings.',
    environmentTarget: 'demo',
    stats: {
      clients: INITIAL_CLIENTS.length,
      matters: INITIAL_MATTERS.length,
      courtEvents: INITIAL_COURT_EVENTS.length,
      invoices: INITIAL_INVOICES.length
    },
    recommendedFor: 'Partner demonstrations, staff training, new associate onboarding, and system evaluation.',
    data: {
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
      auditLogs: INITIAL_AUDIT_LOGS
    }
  },
  {
    id: 'commercial_boutique',
    name: 'Corporate & Commercial Boutique',
    badge: 'Specialized Practice',
    description: 'Tailored for corporate transactional firms, featuring FinTech M&A acquisitions, Tax Appeals Tribunal litigation against KRA, private equity retainers, and Competition Authority clearance filings.',
    environmentTarget: 'staging',
    stats: {
      clients: COMMERCIAL_CLIENTS.length,
      matters: COMMERCIAL_MATTERS.length,
      courtEvents: 2,
      invoices: 2
    },
    recommendedFor: 'Corporate finance boutiques, commercial transactional chambers, and tax law advisory.',
    data: {
      clients: COMMERCIAL_CLIENTS,
      matters: COMMERCIAL_MATTERS,
      courtEvents: [
        {
          id: 'ce-cb1',
          matterId: 'm-cb2',
          matterNumber: 'LF/2026/056',
          matterTitle: 'Equator Power v. Commissioner of Domestic Taxes',
          eventType: 'Hearing',
          court: 'Tax Appeals Tribunal (TAT), Nairobi',
          courtRoom: 'Tribunal Hall B',
          judgeName: 'Hon. Chairman Eric Nyongesa',
          date: '2026-10-08',
          time: '10:00 AM',
          advocateAssigned: 'Jane Wanjiku Kamau',
          status: 'Upcoming',
          reminderDays: [7, 3, 1, 0]
        }
      ],
      documents: [
        {
          id: 'doc-cb1',
          matterId: 'm-cb1',
          matterNumber: 'LF/2026/055',
          title: 'Share Purchase Agreement - Savannah FinTech',
          fileName: 'SPA_Savannah_FinTech_Draft_v4.pdf',
          category: 'Pleadings',
          version: '4.1',
          uploadedBy: 'Phosta Colliner, SC',
          uploadedAt: '2026-09-20',
          fileSize: '4.8 MB',
          fileType: 'pdf',
          tags: ['M&A', 'Corporate', 'Confidential'],
          isClientVisible: true
        }
      ],
      tasks: [
        {
          id: 'task-cb1',
          matterId: 'm-cb1',
          matterNumber: 'LF/2026/055',
          matterTitle: 'Series B Cross-Border Acquisition',
          title: 'Review Competition Authority Exemption Criteria',
          assignedToId: 'u-3',
          assignedToName: 'David Kiprop Cheruiyot',
          assignedRole: 'Senior Associate Advocate',
          deadline: '2026-10-05',
          priority: 'Urgent',
          status: 'In Progress'
        }
      ],
      invoices: [
        {
          id: 'inv-cb1',
          invoiceNumber: 'INV-2026-099',
          matterId: 'm-cb1',
          matterNumber: 'LF/2026/055',
          matterTitle: 'Series B Cross-Border Acquisition',
          clientId: 'c-cb1',
          clientName: 'Savannah FinTech Ventures Limited',
          clientAddress: 'Delta Corner Tower, Westlands, Nairobi',
          clientPin: 'P051992211A',
          dateIssued: '2026-09-15',
          dueDate: '2026-10-15',
          status: 'Sent',
          items: [
            {
              id: 'fee-cb1',
              description: 'Corporate M&A Legal Advisory & Due Diligence Review',
              type: 'professional_fee',
              amount: 1500000
            },
            {
              id: 'fee-cb2',
              description: 'Competition Authority Filing & Regulatory Disbursements',
              type: 'disbursement',
              amount: 250000
            }
          ],
          subtotal: 1750000,
          applyVat: true,
          vatRate: 16,
          vatAmount: 280000,
          totalAmount: 2030000,
          amountPaid: 0,
          balanceDue: 2030000
        }
      ],
      receipts: [],
      trustTransactions: [
        {
          id: 'tr-cb1',
          transactionNumber: 'TR-2026-0105',
          matterId: 'm-cb1',
          matterNumber: 'LF/2026/055',
          matterTitle: 'Series B Cross-Border Acquisition',
          clientId: 'c-cb1',
          clientName: 'Savannah FinTech Ventures Limited',
          type: 'deposit_received',
          amount: 5000000,
          sourceOrPayee: 'Savannah FinTech Escrow Account',
          purpose: 'Completion Escrow Funds (Advocate Stakeholder)',
          date: '2026-09-18',
          verifiedByPartner: 'Phosta Colliner, SC',
          balanceAfter: 5000000
        }
      ],
      officeExpenses: INITIAL_OFFICE_EXPENSES.slice(0, 3),
      timeEntries: [
        {
          id: 'te-cb1',
          matterId: 'm-cb1',
          matterNumber: 'LF/2026/055',
          matterTitle: 'Series B Cross-Border Acquisition',
          advocateId: 'u-1',
          advocateName: 'Phosta Colliner, SC',
          activity: 'Consultation',
          hours: 3.5,
          hourlyRate: 35000,
          billable: true,
          date: '2026-09-25',
          status: 'unbilled',
          notes: 'Advising board on COMESA cross-border merger threshold.'
        }
      ],
      communications: [
        {
          id: 'comm-cb1',
          matterId: 'm-cb1',
          matterNumber: 'LF/2026/055',
          matterTitle: 'Series B Cross-Border Acquisition',
          type: 'Email',
          date: '2026-09-26',
          time: '04:15 PM',
          sender: 'phosta@lexisfirm.co.ke',
          recipient: 'dmutua@savannahfintech.co',
          summary: 'Forwarded revised Term Sheet and disclosure schedule.'
        }
      ],
      conveyancingWorkflow: INITIAL_CONVEYANCING_WORKFLOW,
      auditLogs: [
        {
          id: `audit-cb-${Date.now()}`,
          timestamp: new Date().toISOString(),
          userName: 'Phosta Colliner, SC',
          userRole: 'Managing Partner',
          action: 'DEPLOY_TEMPLATE_PRESET',
          targetType: 'DEPLOYMENT_TEMPLATE',
          targetId: 'commercial_boutique',
          details: 'Initialized Corporate & Commercial Boutique configuration.'
        }
      ]
    }
  },
  {
    id: 'high_volume_litigation',
    name: 'High-Volume Litigation Cause List',
    badge: 'Court Intensive',
    description: 'Configured for high-stakes litigation chambers, featuring active court diary hearings across Milimani Commercial, ELRC, ELC, and Court of Appeal with cause list calendar sync and court clerk tasks.',
    environmentTarget: 'demo',
    stats: {
      clients: INITIAL_CLIENTS.length,
      matters: INITIAL_MATTERS.length,
      courtEvents: LITIGATION_CAUSE_LIST_EVENTS.length,
      invoices: INITIAL_INVOICES.length
    },
    recommendedFor: 'Court litigation departments, trial advocates, and diary managers.',
    data: {
      clients: INITIAL_CLIENTS,
      matters: INITIAL_MATTERS,
      courtEvents: LITIGATION_CAUSE_LIST_EVENTS,
      documents: INITIAL_DOCUMENTS,
      tasks: INITIAL_TASKS,
      invoices: INITIAL_INVOICES,
      receipts: INITIAL_RECEIPTS,
      trustTransactions: INITIAL_TRUST_TRANSACTIONS,
      officeExpenses: INITIAL_OFFICE_EXPENSES,
      timeEntries: INITIAL_TIME_ENTRIES,
      communications: INITIAL_COMMUNICATIONS,
      conveyancingWorkflow: INITIAL_CONVEYANCING_WORKFLOW,
      auditLogs: INITIAL_AUDIT_LOGS
    }
  }
];
