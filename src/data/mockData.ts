import {
  UserProfile,
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
  WorkflowStage
} from '../types';

export const INITIAL_USERS: UserProfile[] = [
  {
    id: 'u-1',
    name: 'Phosta Colliner, SC',
    email: 'phosta@lexisfirm.co.ke',
    role: 'managing_partner',
    barNumber: 'P105/18420/20',
    phone: '+254 722 000 111',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    title: 'Managing Partner'
  },
  {
    id: 'u-2',
    name: 'Jane Wanjiku Kamau',
    email: 'jane.kamau@lexisfirm.co.ke',
    role: 'partner',
    barNumber: 'P105/14290/18',
    phone: '+254 723 456 789',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    title: 'Partner - Commercial Litigation'
  },
  {
    id: 'u-3',
    name: 'David Kiprop Cheruiyot',
    email: 'david.kiprop@lexisfirm.co.ke',
    role: 'associate',
    barNumber: 'P105/21450/22',
    phone: '+254 711 223 344',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    title: 'Senior Associate Advocate'
  },
  {
    id: 'u-4',
    name: 'Faith Akinyi Otieno',
    email: 'faith.otieno@lexisfirm.co.ke',
    role: 'associate',
    barNumber: 'P105/24890/24',
    phone: '+254 700 889 900',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    title: 'Associate Advocate'
  },
  {
    id: 'u-5',
    name: 'Brian Mutua',
    email: 'brian.mutua@lexisfirm.co.ke',
    role: 'clerk',
    phone: '+254 712 345 678',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    title: 'Chief Court Registry Clerk'
  },
  {
    id: 'u-6',
    name: 'Beatrice Ndinda, CPA-K',
    email: 'accounts@lexisfirm.co.ke',
    role: 'accounts',
    phone: '+254 721 998 877',
    avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&auto=format&fit=crop&q=80',
    title: 'Head of Finance & Trust Accounting'
  }
];

export const INITIAL_CLIENTS: Client[] = [
  {
    id: 'c-1',
    clientNumber: 'CL-2024-001',
    name: 'ABC Limited',
    type: 'company',
    contactPerson: 'Peter Munene (Managing Director)',
    email: 'pmunene@abclimited.co.ke',
    phone: '+254 720 123 456',
    address: 'Chaka Place, Argwings Kodhek Rd, Kilimani, Nairobi',
    idOrRegNumber: 'CPR/2018/98124',
    kraPin: 'P051289341X',
    status: 'active',
    portalAccess: true,
    matterCount: 2,
    outstandingBalance: 85000,
    createdDate: '2024-03-12',
    notes: 'Long-standing corporate retainer client. Monthly billing cycle.'
  },
  {
    id: 'c-2',
    clientNumber: 'CL-2024-045',
    name: 'Nairobi Heights Developers Ltd',
    type: 'company',
    contactPerson: 'Eng. Francis Gichuru',
    email: 'fgichuru@nairobiheights.com',
    phone: '+254 733 999 888',
    address: 'Delta Corner Tower A, 7th Floor, Westlands, Nairobi',
    idOrRegNumber: 'CPR/2015/34190',
    kraPin: 'P051390112A',
    status: 'active',
    portalAccess: true,
    matterCount: 1,
    outstandingBalance: 0,
    createdDate: '2024-08-19',
    notes: 'Major property developer. Conveyancing and joint venture projects.'
  },
  {
    id: 'c-3',
    clientNumber: 'CL-2025-012',
    name: 'Dr. Florence Muthoni Mwangi',
    type: 'individual',
    email: 'florence.mwangi@gmail.com',
    phone: '+254 722 777 666',
    address: 'Lavington Green Villa 14, Nairobi',
    idOrRegNumber: 'ID 22894103',
    kraPin: 'A003892145B',
    status: 'active',
    portalAccess: true,
    matterCount: 1,
    outstandingBalance: 120000,
    createdDate: '2025-01-10',
    notes: 'High-value medical negligence suit and family trust structuring.'
  },
  {
    id: 'c-4',
    clientNumber: 'CL-2025-088',
    name: 'Rift Valley Agribusiness Ltd',
    type: 'company',
    contactPerson: 'Hassan Omar (CFO)',
    email: 'hassan@rvagri.co.ke',
    phone: '+254 724 332 211',
    address: 'Commercial Street, Industrial Area, Nakuru',
    idOrRegNumber: 'CPR/2019/55120',
    kraPin: 'P051672341M',
    status: 'active',
    portalAccess: false,
    matterCount: 1,
    outstandingBalance: 240000,
    createdDate: '2025-06-04'
  },
  {
    id: 'c-5',
    clientNumber: 'CL-2026-003',
    name: 'John Kariuki Njoroge',
    type: 'individual',
    email: 'kariuki.njoroge@yahoo.com',
    phone: '+254 710 445 566',
    address: 'Kikuyu Town, Kiambu County',
    idOrRegNumber: 'ID 14209841',
    kraPin: 'A001928475K',
    status: 'active',
    portalAccess: true,
    matterCount: 1,
    outstandingBalance: 45000,
    createdDate: '2026-02-14'
  },
  {
    id: 'c-6',
    clientNumber: 'CL-2026-019',
    name: 'Apex Holdings Kenya Limited',
    type: 'company',
    contactPerson: 'Grace Chemutai',
    email: 'info@apexholdings.co.ke',
    phone: '+254 728 901 234',
    address: 'The Promenade, General Mathenge, Nairobi',
    idOrRegNumber: 'CPR/2021/77889',
    kraPin: 'P051892340D',
    status: 'prospective',
    portalAccess: false,
    matterCount: 0,
    outstandingBalance: 0,
    createdDate: '2026-09-20',
    notes: 'Prospective client intake in progress. Conflict check pending verification.'
  }
];

export const INITIAL_MATTERS: Matter[] = [
  {
    id: 'm-1',
    matterNumber: 'LF/2026/014',
    clientId: 'c-1',
    clientName: 'ABC Limited',
    title: 'ABC Limited v. XYZ Logistics Limited & 2 Others',
    category: 'Employment',
    court: 'Employment and Labour Relations Court at Nairobi',
    caseNumber: 'ELRC Cause No. 89 of 2026',
    opposingParty: 'XYZ Logistics Limited',
    opposingAdvocate: 'Mohammed & Muigai Advocates',
    leadAdvocateId: 'u-1',
    leadAdvocateName: 'Phosta Colliner, SC',
    assignedClerkId: 'u-5',
    assignedClerkName: 'Brian Mutua',
    dateOpened: '2026-01-20',
    status: 'Hearing Scheduled',
    priority: 'Urgent',
    estimatedValue: 4500000,
    nextAction: 'Appear for inter-partes hearing and tender cross-examination on witness affidavits',
    nextDeadline: '2026-09-29',
    workflowStage: 'Pre-Trial Hearing',
    notes: 'Employment dispute concerning wrongful termination claims by executive directors.'
  },
  {
    id: 'm-2',
    matterNumber: 'LF/2026/022',
    clientId: 'c-2',
    clientName: 'Nairobi Heights Developers Ltd',
    title: 'Purchase & Transfer of L.R. No. 209/14250/8 (Kilimani Parcel)',
    category: 'Conveyancing',
    court: 'Lands Registry (Ardhi House, Nairobi)',
    caseNumber: 'CONV/2026/084',
    opposingParty: 'Prime Properties Holdings Ltd (Vendor)',
    opposingAdvocate: 'Bowmans (Coulson Harney LLP)',
    leadAdvocateId: 'u-2',
    leadAdvocateName: 'Jane Wanjiku Kamau',
    assignedClerkId: 'u-5',
    assignedClerkName: 'Brian Mutua',
    dateOpened: '2026-02-15',
    status: 'In Conveyancing',
    priority: 'High',
    estimatedValue: 85000000,
    nextAction: 'Lodge Transfer Instruments and Valuer Report for Stamp Duty assessment',
    nextDeadline: '2026-10-05',
    workflowStage: 'Stamp Duty Assessment',
    notes: 'Commercial land purchase. 10% deposit held securely in firm trust account.'
  },
  {
    id: 'm-3',
    matterNumber: 'LF/2026/031',
    clientId: 'c-3',
    clientName: 'Dr. Florence Muthoni Mwangi',
    title: 'Dr. Florence Muthoni v. St. Jude Hospital & Dr. Robert Ochieng',
    category: 'Civil litigation',
    court: 'High Court of Kenya (Milimani Civil Division)',
    caseNumber: 'HCCC No. E142 of 2026',
    opposingParty: 'St. Jude Hospital Board of Trustees & Dr. Robert Ochieng',
    opposingAdvocate: 'Iseme, Kamau & Maema Advocates (DLA Piper)',
    leadAdvocateId: 'u-3',
    leadAdvocateName: 'David Kiprop Cheruiyot',
    assignedClerkId: 'u-5',
    assignedClerkName: 'Brian Mutua',
    dateOpened: '2026-03-08',
    status: 'Pleadings',
    priority: 'High',
    estimatedValue: 12000000,
    nextAction: 'File Reply to Defence and Request for Further and Better Particulars',
    nextDeadline: '2026-10-10',
    workflowStage: 'Exchange of Pleadings',
    notes: 'Medical negligence claim resulting in permanent surgical impairment.'
  },
  {
    id: 'm-4',
    matterNumber: 'LF/2026/039',
    clientId: 'c-4',
    clientName: 'Rift Valley Agribusiness Ltd',
    title: 'Rift Valley Agribusiness Ltd v. Apex Milling Millers Ltd',
    category: 'Debt recovery',
    court: 'Milimani Commercial Courts, Nairobi',
    caseNumber: 'CMCC No. 712 of 2026',
    opposingParty: 'Apex Milling Millers Ltd',
    opposingAdvocate: 'Kaplan & Stratton Advocates',
    leadAdvocateId: 'u-4',
    leadAdvocateName: 'Faith Akinyi Otieno',
    assignedClerkId: 'u-5',
    assignedClerkName: 'Brian Mutua',
    dateOpened: '2026-04-18',
    status: 'Active',
    priority: 'Medium',
    estimatedValue: 6800000,
    nextAction: 'File formal summons to enter appearance and affidavit of service',
    nextDeadline: '2026-10-02',
    workflowStage: 'Summons & Service',
    notes: 'Recovery of outstanding grain supplies delivery under credit invoices.'
  },
  {
    id: 'm-5',
    matterNumber: 'LF/2026/045',
    clientId: 'c-3',
    clientName: 'Dr. Florence Muthoni Mwangi',
    title: 'In the Matter of the Estate of Wilson Gichuru Mwangi (Deceased)',
    category: 'Succession',
    court: 'High Court Family Division at Nairobi',
    caseNumber: 'Succession Cause No. 210 of 2026',
    opposingParty: 'Caveator: Beatrice Wambui & 1 Other',
    opposingAdvocate: 'Anjarwalla & Khanna LLP',
    leadAdvocateId: 'u-1',
    leadAdvocateName: 'Phosta Colliner, SC',
    assignedClerkId: 'u-5',
    assignedClerkName: 'Brian Mutua',
    dateOpened: '2026-05-11',
    status: 'Pending Ruling',
    priority: 'Urgent',
    estimatedValue: 35000000,
    nextAction: 'Ruling on Summons for Confirmation of Grant',
    nextDeadline: '2026-10-08',
    workflowStage: 'Confirmation of Grant',
    notes: 'Succession petition and distribution of tea estate and commercial properties.'
  },
  {
    id: 'm-6',
    matterNumber: 'LF/2026/051',
    clientId: 'c-5',
    clientName: 'John Kariuki Njoroge',
    title: 'John Kariuki Njoroge v. National Land Commission & Kenya Railways',
    category: 'Land',
    court: 'Environment and Land Court at Nairobi',
    caseNumber: 'ELC No. 204 of 2026',
    opposingParty: 'National Land Commission & Kenya Railways Corporation',
    opposingAdvocate: 'State Law Office (Attorney General) & Muma & Kanjama',
    leadAdvocateId: 'u-3',
    leadAdvocateName: 'David Kiprop Cheruiyot',
    assignedClerkId: 'u-5',
    assignedClerkName: 'Brian Mutua',
    dateOpened: '2026-06-01',
    status: 'Discovery',
    priority: 'Medium',
    estimatedValue: 18500000,
    nextAction: 'Joint site inspection report filing by registered cadastral surveyor',
    nextDeadline: '2026-10-14',
    workflowStage: 'Discovery & Inspection',
    notes: 'Compulsory acquisition compensation boundary dispute.'
  }
];

export const INITIAL_COURT_EVENTS: CourtEvent[] = [
  {
    id: 'ce-1',
    matterId: 'm-1',
    matterNumber: 'LF/2026/014',
    matterTitle: 'ABC Limited v. XYZ Logistics Limited',
    eventType: 'Hearing',
    court: 'Employment and Labour Relations Court at Nairobi',
    courtRoom: 'Courtroom 4, 2nd Floor',
    judgeName: 'Hon. Lady Justice Hellen Wasilwa',
    date: '2026-09-29', // Tomorrow relative to current app context
    time: '09:00 AM',
    advocateAssigned: 'Phosta Colliner, SC',
    status: 'Upcoming',
    notes: '⚠️ Urgent: High priority inter-partes hearing. Plaintiff witness testimony.',
    reminderDays: [30, 14, 7, 3, 1, 0]
  },
  {
    id: 'ce-2',
    matterId: 'm-4',
    matterNumber: 'LF/2026/039',
    matterTitle: 'Rift Valley Agribusiness Ltd v. Apex Milling',
    eventType: 'Mention',
    court: 'Milimani Commercial Courts, Nairobi',
    courtRoom: 'Courtroom 6B',
    judgeName: 'Hon. Senior Principal Magistrate D. Kigen',
    date: '2026-10-02',
    time: '09:30 AM',
    advocateAssigned: 'Faith Akinyi Otieno',
    status: 'Upcoming',
    notes: 'Mention to confirm compliance with pre-trial orders and filing of affidavit of service.',
    reminderDays: [14, 7, 3, 1, 0]
  },
  {
    id: 'ce-3',
    matterId: 'm-5',
    matterNumber: 'LF/2026/045',
    matterTitle: 'Estate of Wilson Gichuru Mwangi (Deceased)',
    eventType: 'Ruling',
    court: 'High Court Family Division at Nairobi',
    courtRoom: 'Virtual Court Session (Microsoft Teams Link #4)',
    judgeName: 'Hon. Mr. Justice Aggrey Muchelule',
    date: '2026-10-08',
    time: '10:00 AM',
    advocateAssigned: 'Phosta Colliner, SC',
    status: 'Upcoming',
    notes: 'Ruling on preliminary objection challenging testamentary capacity of testator.',
    reminderDays: [14, 7, 3, 1, 0]
  },
  {
    id: 'ce-4',
    matterId: 'm-3',
    matterNumber: 'LF/2026/031',
    matterTitle: 'Dr. Florence Muthoni v. St. Jude Hospital',
    eventType: 'Pre-Trial Conference',
    court: 'High Court of Kenya (Milimani Civil Division)',
    courtRoom: 'Chambers of the Deputy Registrar',
    judgeName: 'Hon. Deputy Registrar F. Mwangi',
    date: '2026-10-10',
    time: '11:00 AM',
    advocateAssigned: 'David Kiprop Cheruiyot',
    status: 'Upcoming',
    notes: 'Pre-trial conference under Order 11 of the Civil Procedure Rules.',
    reminderDays: [14, 7, 3, 1, 0]
  },
  {
    id: 'ce-5',
    matterId: 'm-6',
    matterNumber: 'LF/2026/051',
    matterTitle: 'Kariuki v. NLC & Kenya Railways',
    eventType: 'Hearing',
    court: 'Environment and Land Court at Nairobi',
    courtRoom: 'Court 2',
    judgeName: 'Hon. Lady Justice Komingoi',
    date: '2026-10-14',
    time: '09:00 AM',
    advocateAssigned: 'David Kiprop Cheruiyot',
    status: 'Upcoming',
    notes: 'Hearing of preliminary injunction application restraining trespass.',
    reminderDays: [30, 14, 7, 3, 1, 0]
  },
  {
    id: 'ce-6',
    matterId: 'm-1',
    matterNumber: 'LF/2026/014',
    matterTitle: 'ABC Limited v. XYZ Logistics Limited',
    eventType: 'Mention',
    court: 'Employment and Labour Relations Court at Nairobi',
    judgeName: 'Hon. Lady Justice Hellen Wasilwa',
    date: '2026-08-15',
    time: '09:00 AM',
    advocateAssigned: 'Jane Wanjiku Kamau',
    status: 'Completed',
    notes: 'Directions issued for filing of witness statements within 21 days.',
    reminderDays: [7, 1]
  }
];

export const INITIAL_DOCUMENTS: LegalDocument[] = [
  {
    id: 'doc-1',
    matterId: 'm-1',
    matterNumber: 'LF/2026/014',
    title: 'Plaint & Verifying Affidavit',
    fileName: 'ELRC_Plaint_ABC_v_XYZ.pdf',
    category: 'Pleadings',
    version: 'v1.2 (Stamped)',
    uploadedBy: 'Phosta Colliner, SC',
    uploadedAt: '2026-01-22',
    fileSize: '2.4 MB',
    fileType: 'PDF',
    tags: ['Originating Process', 'Stamped', 'ELRC'],
    isClientVisible: true,
    contentSnippet: `IN THE EMPLOYMENT AND LABOUR RELATIONS COURT AT NAIROBI
CAUSE NO. 89 OF 2026
ABC LIMITED ......................................... CLAIMANT
VERSUS
XYZ LOGISTICS LIMITED ................... 1ST RESPONDENT
JOHN DOE NJOROGE .......................... 2ND RESPONDENT

STATEMENT OF CLAIM
1. The Claimant is a limited liability company duly incorporated under the Companies Act 2015...
2. The 1st Respondent was at all material times an enterprise logistics contractor in breach of employment covenants...
WHEREFORE the Claimant prays for judgment against the Respondents jointly and severally for:
(a) Special damages in the sum of KSh 4,500,000;
(b) Permanent injunction restraining disclosure of proprietary trade secrets;
(c) Costs of this suit and interest.`
  },
  {
    id: 'doc-2',
    matterId: 'm-1',
    matterNumber: 'LF/2026/014',
    title: 'Statement of Defence and Counterclaim',
    fileName: 'Defence_XYZ_Logistics.pdf',
    category: 'Pleadings',
    version: 'v1.0',
    uploadedBy: 'Brian Mutua',
    uploadedAt: '2026-02-10',
    fileSize: '1.8 MB',
    fileType: 'PDF',
    tags: ['Defence', 'Opposing Counsel', 'Counterclaim'],
    isClientVisible: true,
    contentSnippet: `STATEMENT OF DEFENCE & COUNTERCLAIM
The Respondents deny each and every allegation of fact in the Claim as if the same were set forth and specifically traversed...
The Respondents aver that the termination was constructive and lawful under Section 45 of the Employment Act 2007.`
  },
  {
    id: 'doc-3',
    matterId: 'm-1',
    matterNumber: 'LF/2026/014',
    title: 'Court Order of 12th Sept 2026',
    fileName: 'Court_Order_ELRC_12092026.pdf',
    category: 'Court Orders',
    version: 'v1.0 (Sealed)',
    uploadedBy: 'Brian Mutua',
    uploadedAt: '2026-09-13',
    fileSize: '840 KB',
    fileType: 'PDF',
    tags: ['Court Order', 'Interim Relief', 'Sealed'],
    isClientVisible: true,
    contentSnippet: `UPON READING the Application dated 28th August 2026 brought under Certificate of Urgency...
IT IS HEREBY ORDERED:
1. That an interim order of maintenance of status quo be and is hereby issued pending hearing.
2. That the matter be fixed for inter-partes hearing on 29th September 2026.`
  },
  {
    id: 'doc-4',
    matterId: 'm-2',
    matterNumber: 'LF/2026/022',
    title: 'Agreement for Sale (Executed)',
    fileName: 'Sale_Agreement_LR_209_14250.pdf',
    category: 'Conveyancing Deeds',
    version: 'v2.0 (Duly Executed)',
    uploadedBy: 'Jane Wanjiku Kamau',
    uploadedAt: '2026-03-01',
    fileSize: '4.2 MB',
    fileType: 'PDF',
    tags: ['Sale Agreement', 'Ardhi House', 'Title LR 209/14250/8'],
    isClientVisible: true,
    contentSnippet: `AGREEMENT FOR SALE OF LAND
PARCEL: L.R. NO. 209/14250/8, KILIMANI NAIROBI
PURCHASE PRICE: KSh 85,000,000 (EIGHTY-FIVE MILLION KENYA SHILLINGS)
DEPOSIT: KSh 8,500,000 (10% paid to LexisFirm Advocates as Stakeholder)
COMPLETION PERIOD: 90 days from the date hereof...`
  },
  {
    id: 'doc-5',
    matterId: 'm-2',
    matterNumber: 'LF/2026/022',
    title: 'Official Lands Search Certificate',
    fileName: 'Search_Cert_Ardhi_LR209_14250.pdf',
    category: 'Conveyancing Deeds',
    version: 'v1.0',
    uploadedBy: 'Brian Mutua',
    uploadedAt: '2026-02-18',
    fileSize: '620 KB',
    fileType: 'PDF',
    tags: ['Official Search', 'Clean Title', 'ArdhiSasisha'],
    isClientVisible: true,
    contentSnippet: `MINISTRY OF LANDS AND PHYSICAL PLANNING
OFFICIAL SEARCH CERTIFICATE UNDER SECTION 34 OF LAND REGISTRATION ACT 2012
Title No: Nairobi/Block/209/14250/8
Registered Owner: Prime Properties Holdings Limited
Encumbrances: NIL. Title is clean and unencumbered.`
  },
  {
    id: 'doc-6',
    matterId: 'm-3',
    matterNumber: 'LF/2026/031',
    title: 'Medical Board Expert Report',
    fileName: 'KMPDC_Expert_Medical_Report.pdf',
    category: 'Evidence',
    version: 'v1.0',
    uploadedBy: 'David Kiprop Cheruiyot',
    uploadedAt: '2026-03-15',
    fileSize: '3.1 MB',
    fileType: 'PDF',
    tags: ['Expert Witness', 'KMPDC', 'Confidential'],
    isClientVisible: false,
    contentSnippet: `KENYA MEDICAL PRACTITIONERS AND DENTISTS COUNCIL (KMPDC)
INDEPENDENT EXPERT OPINION IN DISCIPLINARY COMPLAINT NO. 44 OF 2025
Conclusion: There was deviation from standard surgical protocol during post-operative intensive care...`
  },
  {
    id: 'doc-7',
    matterId: 'm-1',
    matterNumber: 'LF/2026/014',
    title: 'Interim Fee Note INV-2026-018',
    fileName: 'Fee_Note_ABC_INV018.pdf',
    category: 'Billing',
    version: 'v1.0',
    uploadedBy: 'Beatrice Ndinda, CPA-K',
    uploadedAt: '2026-03-30',
    fileSize: '410 KB',
    fileType: 'PDF',
    tags: ['Invoice', 'Fee Note', 'Client Copy'],
    isClientVisible: true,
    contentSnippet: `LEXISFIRM ADVOCATES LLP
FEE NOTE & DISBURSEMENTS INVOICE NO: INV-2026-018
Client: ABC Limited
Matter: ELRC Cause No. 89 of 2026
Professional Fees: KSh 150,000 | Court Fees: KSh 20,000 | Disbursements: KSh 15,000 | Total: KSh 185,000`
  }
];

export const INITIAL_TASKS: Task[] = [
  {
    id: 'tsk-1',
    matterId: 'm-1',
    matterNumber: 'LF/2026/014',
    matterTitle: 'ABC Limited v. XYZ Logistics',
    title: 'Prepare cross-examination bundle for Hearing tomorrow',
    assignedToId: 'u-1',
    assignedToName: 'Phosta Colliner, SC',
    assignedRole: 'Managing Partner',
    deadline: '2026-09-28', // Today
    priority: 'Urgent',
    status: 'In Progress',
    notes: 'Review 1st Respondent supplementary affidavit and tab conflicting timeline exhibits.'
  },
  {
    id: 'tsk-2',
    matterId: 'm-1',
    matterNumber: 'LF/2026/014',
    matterTitle: 'ABC Limited v. XYZ Logistics',
    title: 'Obtain certified bank statements exhibit from client MD',
    assignedToId: 'u-5',
    assignedToName: 'Brian Mutua',
    assignedRole: 'Legal Clerk',
    deadline: '2026-09-27',
    priority: 'High',
    status: 'Complete',
    completedAt: '2026-09-27'
  },
  {
    id: 'tsk-3',
    matterId: 'm-2',
    matterNumber: 'LF/2026/022',
    matterTitle: 'Purchase of LR No. 209/14250/8',
    title: 'Lodge transfer documents on ArdhiSasisha platform',
    assignedToId: 'u-5',
    assignedToName: 'Brian Mutua',
    assignedRole: 'Legal Clerk',
    deadline: '2026-10-05',
    priority: 'High',
    status: 'Pending',
    notes: 'Ensure valuer inspection report is attached before final submission.'
  },
  {
    id: 'tsk-4',
    matterId: 'm-3',
    matterNumber: 'LF/2026/031',
    matterTitle: 'Dr. Florence Muthoni v. St. Jude Hospital',
    title: 'Draft Request for Further and Better Particulars',
    assignedToId: 'u-3',
    assignedToName: 'David Kiprop Cheruiyot',
    assignedRole: 'Associate Advocate',
    deadline: '2026-10-06',
    priority: 'Medium',
    status: 'In Progress',
    notes: 'Challenge paragraph 14 of Statement of Defence regarding hospital vicarious liability.'
  },
  {
    id: 'tsk-5',
    matterId: 'm-4',
    matterNumber: 'LF/2026/039',
    matterTitle: 'Rift Valley Agribusiness v. Apex Milling',
    title: 'File Summons and Affidavit of Service before Mention',
    assignedToId: 'u-5',
    assignedToName: 'Brian Mutua',
    assignedRole: 'Legal Clerk',
    deadline: '2026-10-01',
    priority: 'Urgent',
    status: 'Pending',
    notes: 'Process service on opposing managing director in Nakuru.'
  },
  {
    id: 'tsk-6',
    matterId: 'm-1',
    matterNumber: 'LF/2026/014',
    matterTitle: 'ABC Limited v. XYZ Logistics',
    title: 'Send reminder SMS/Email to Client MD on Court Appearance',
    assignedToId: 'u-4',
    assignedToName: 'Faith Akinyi Otieno',
    assignedRole: 'Associate Advocate',
    deadline: '2026-09-28',
    priority: 'High',
    status: 'Pending'
  }
];

export const INITIAL_INVOICES: Invoice[] = [
  {
    id: 'inv-1',
    invoiceNumber: 'INV-2026-018',
    matterId: 'm-1',
    matterNumber: 'LF/2026/014',
    matterTitle: 'ABC Limited v. XYZ Logistics Limited',
    clientId: 'c-1',
    clientName: 'ABC Limited',
    clientAddress: 'Chaka Place, Argwings Kodhek Rd, Kilimani, Nairobi',
    clientPin: 'P051289341X',
    dateIssued: '2026-03-30',
    dueDate: '2026-04-30',
    status: 'Partially Paid',
    items: [
      { id: 'fi-1', description: 'Professional Legal Fee: Drafting Plaint & Certificate of Urgency', type: 'professional_fee', amount: 150000 },
      { id: 'fi-2', description: 'Statutory Court Registry Filing Fees & E-filing Levy', type: 'court_fee', amount: 20000 },
      { id: 'fi-3', description: 'Official Company Registry Search on 1st Respondent', type: 'search_fee', amount: 5000 },
      { id: 'fi-4', description: 'Process Server Affidavit of Service & Travel Disbursements', type: 'disbursement', amount: 10000 }
    ],
    subtotal: 185000,
    applyVat: false, // disbursements and professional fee package agreed net
    vatRate: 16,
    vatAmount: 0,
    totalAmount: 185000,
    amountPaid: 100000,
    balanceDue: 85000,
    notes: 'Paid KSh 100,000 on 15 April via Bank Wire. Outstanding balance KSh 85,000.'
  },
  {
    id: 'inv-2',
    invoiceNumber: 'INV-2026-042',
    matterId: 'm-2',
    matterNumber: 'LF/2026/022',
    matterTitle: 'Purchase & Transfer of LR No. 209/14250/8',
    clientId: 'c-2',
    clientName: 'Nairobi Heights Developers Ltd',
    clientAddress: 'Delta Corner Tower A, Westlands, Nairobi',
    clientPin: 'P051390112A',
    dateIssued: '2026-03-10',
    dueDate: '2026-04-10',
    status: 'Paid',
    items: [
      { id: 'fi-5', description: 'Conveyancing Professional Fees (Scale under Advocates Remuneration Order)', type: 'professional_fee', amount: 750000 },
      { id: 'fi-6', description: 'Official Land Search & Rates Clearance Certificate', type: 'search_fee', amount: 15000 },
      { id: 'fi-7', description: 'ArdhiSasisha Digital Lodgement Disbursements', type: 'disbursement', amount: 10000 },
      { id: 'fi-8', description: 'Value Added Tax (VAT 16%) on Professional Fees', type: 'professional_fee', amount: 120000 }
    ],
    subtotal: 775000,
    applyVat: true,
    vatRate: 16,
    vatAmount: 120000,
    totalAmount: 895000,
    amountPaid: 895000,
    balanceDue: 0,
    notes: 'Settled in full via RTGS Transfer on 25 March 2026.'
  },
  {
    id: 'inv-3',
    invoiceNumber: 'INV-2026-065',
    matterId: 'm-3',
    matterNumber: 'LF/2026/031',
    matterTitle: 'Dr. Florence Muthoni v. St. Jude Hospital',
    clientId: 'c-3',
    clientName: 'Dr. Florence Muthoni Mwangi',
    clientAddress: 'Lavington Green Villa 14, Nairobi',
    clientPin: 'A003892145B',
    dateIssued: '2026-04-05',
    dueDate: '2026-05-05',
    status: 'Sent',
    items: [
      { id: 'fi-9', description: 'Retainer & Initial Legal Research for Medical Negligence Suit', type: 'professional_fee', amount: 120000 },
      { id: 'fi-10', description: 'Court Filing & Assessment Fees at Milimani High Court Registry', type: 'court_fee', amount: 35000 }
    ],
    subtotal: 155000,
    applyVat: false,
    vatRate: 16,
    vatAmount: 0,
    totalAmount: 155000,
    amountPaid: 35000,
    balanceDue: 120000,
    notes: 'Deposit paid for filing fees. Remainder overdue 30+ days.'
  },
  {
    id: 'inv-4',
    invoiceNumber: 'INV-2026-077',
    matterId: 'm-4',
    matterNumber: 'LF/2026/039',
    matterTitle: 'Rift Valley Agribusiness v. Apex Milling',
    clientId: 'c-4',
    clientName: 'Rift Valley Agribusiness Ltd',
    clientAddress: 'Industrial Area, Nakuru',
    clientPin: 'P051672341M',
    dateIssued: '2026-05-10',
    dueDate: '2026-06-10',
    status: 'Overdue',
    items: [
      { id: 'fi-11', description: 'Drafting Statutory Demand & Fast Track Commercial Plaint', type: 'drafting', amount: 200000 },
      { id: 'fi-12', description: 'Filing & Commissioner for Oaths Attestation Fees', type: 'court_fee', amount: 40000 }
    ],
    subtotal: 240000,
    applyVat: false,
    vatRate: 16,
    vatAmount: 0,
    totalAmount: 240000,
    amountPaid: 0,
    balanceDue: 240000,
    notes: 'Overdue. Second reminder notice dispatched.'
  }
];

export const INITIAL_RECEIPTS: PaymentReceipt[] = [
  {
    id: 'rec-1',
    receiptNumber: 'REC-2026-0034',
    invoiceId: 'inv-1',
    invoiceNumber: 'INV-2026-018',
    matterId: 'm-1',
    clientName: 'ABC Limited',
    amount: 100000,
    paymentMethod: 'RTGS / Bank Wire',
    referenceNumber: 'CBK-TX-9988231',
    date: '2026-04-15',
    accountType: 'office',
    receivedBy: 'Beatrice Ndinda, CPA-K'
  },
  {
    id: 'rec-2',
    receiptNumber: 'REC-2026-0041',
    invoiceId: 'inv-2',
    invoiceNumber: 'INV-2026-042',
    matterId: 'm-2',
    clientName: 'Nairobi Heights Developers Ltd',
    amount: 895000,
    paymentMethod: 'RTGS / Bank Wire',
    referenceNumber: 'STANBIC-RTGS-77123',
    date: '2026-03-25',
    accountType: 'office',
    receivedBy: 'Beatrice Ndinda, CPA-K'
  }
];

// Advocates Accounts Rules (Client / Trust Account Ledger - strictly segregated)
export const INITIAL_TRUST_TRANSACTIONS: TrustTransaction[] = [
  {
    id: 'tr-1',
    transactionNumber: 'TR-2026-0012',
    matterId: 'm-2',
    matterNumber: 'LF/2026/022',
    matterTitle: 'Purchase & Transfer of LR No. 209/14250/8',
    clientId: 'c-2',
    clientName: 'Nairobi Heights Developers Ltd',
    type: 'deposit_received',
    amount: 8500000, // 10% Stakeholder deposit
    sourceOrPayee: 'Nairobi Heights Developers Ltd (via Stanbic Bank)',
    purpose: '10% Stakeholder deposit pursuant to Clause 3 of Agreement for Sale LR 209/14250/8',
    date: '2026-02-28',
    verifiedByPartner: 'Phosta Colliner, SC',
    supportingDocRef: 'Sale Agreement Clause 3',
    balanceAfter: 8500000
  },
  {
    id: 'tr-2',
    transactionNumber: 'TR-2026-0019',
    matterId: 'm-5',
    matterNumber: 'LF/2026/045',
    matterTitle: 'Estate of Wilson Gichuru Mwangi (Deceased)',
    clientId: 'c-3',
    clientName: 'Dr. Florence Muthoni Mwangi',
    type: 'deposit_received',
    amount: 2200000,
    sourceOrPayee: 'Kenya Commercial Bank (Deceased Account Closure Proceeds)',
    purpose: 'Proceeds of deceased fixed deposit received for distribution to beneficiaries upon confirmation',
    date: '2026-06-14',
    verifiedByPartner: 'Jane Wanjiku Kamau',
    supportingDocRef: 'KCB Grant Production letter',
    balanceAfter: 10700000
  },
  {
    id: 'tr-3',
    transactionNumber: 'TR-2026-0025',
    matterId: 'm-2',
    matterNumber: 'LF/2026/022',
    matterTitle: 'Purchase & Transfer of LR No. 209/14250/8',
    clientId: 'c-2',
    clientName: 'Nairobi Heights Developers Ltd',
    type: 'client_disbursement',
    amount: 1500000,
    sourceOrPayee: 'Commissioner of Lands (Kenya Revenue Authority via ArdhiSasisha)',
    purpose: 'Direct payment of statutory Stamp Duty assessed on Transfer (Ardhi PRN 908124)',
    date: '2026-07-20',
    verifiedByPartner: 'Phosta Colliner, SC',
    supportingDocRef: 'KRA Stamp Duty Slip',
    balanceAfter: 9200000
  }
];

export const INITIAL_OFFICE_EXPENSES: OfficeExpense[] = [
  {
    id: 'exp-1',
    expenseNumber: 'EXP-2026-081',
    category: 'Rent & Utilities',
    description: 'Chambers Monthly Rent - Upper Hill Chambers 4th Floor',
    amount: 320000,
    date: '2026-09-01',
    paidTo: 'Upper Hill Chambers Property Management Ltd',
    paymentMethod: 'Bank Wire',
    approvedBy: 'Phosta Colliner, SC'
  },
  {
    id: 'exp-2',
    expenseNumber: 'EXP-2026-085',
    category: 'IT & Software',
    description: 'LexisNexis & LawAfrica Digital Legal Law Reports Annual Subscription',
    amount: 95000,
    date: '2026-09-05',
    paidTo: 'LawAfrica Publishing Ltd',
    paymentMethod: 'Credit Card',
    approvedBy: 'Jane Wanjiku Kamau'
  },
  {
    id: 'exp-3',
    expenseNumber: 'EXP-2026-091',
    category: 'Court Filing Fees',
    description: 'Petty cash disbursement float for Judiciary E-filing Portal',
    amount: 45000,
    date: '2026-09-12',
    paidTo: 'Judiciary Registrar Nairobi',
    paymentMethod: 'M-Pesa Business Till',
    approvedBy: 'Beatrice Ndinda, CPA-K'
  },
  {
    id: 'exp-4',
    expenseNumber: 'EXP-2026-094',
    category: 'Office Administration',
    description: 'Legal stationery, court red ribbons, secure document binders & toner',
    amount: 38000,
    date: '2026-09-18',
    paidTo: 'Text Book Centre Nairobi',
    paymentMethod: 'Bank Transfer',
    approvedBy: 'Beatrice Ndinda, CPA-K'
  }
];

export const INITIAL_TIME_ENTRIES: TimeEntry[] = [
  {
    id: 'te-1',
    matterId: 'm-1',
    matterNumber: 'LF/2026/014',
    matterTitle: 'ABC Limited v. XYZ Logistics',
    advocateId: 'u-1',
    advocateName: 'Phosta Colliner, SC',
    activity: 'Court Attendance',
    hours: 2.5,
    hourlyRate: 35000,
    billable: true,
    date: '2026-08-15',
    status: 'billed',
    notes: 'Virtual mention before Hon. Justice Wasilwa; obtained trial directions.'
  },
  {
    id: 'te-2',
    matterId: 'm-1',
    matterNumber: 'LF/2026/014',
    matterTitle: 'ABC Limited v. XYZ Logistics',
    advocateId: 'u-1',
    advocateName: 'Phosta Colliner, SC',
    activity: 'Legal Research',
    hours: 3.0,
    hourlyRate: 35000,
    billable: true,
    date: '2026-09-25',
    status: 'unbilled',
    notes: 'Researching recent Supreme Court precedents on constructive dismissal in executive roles.'
  },
  {
    id: 'te-3',
    matterId: 'm-2',
    matterNumber: 'LF/2026/022',
    matterTitle: 'Purchase of LR No. 209/14250/8',
    advocateId: 'u-2',
    advocateName: 'Jane Wanjiku Kamau',
    activity: 'Drafting Pleadings',
    hours: 4.0,
    hourlyRate: 25000,
    billable: true,
    date: '2026-08-20',
    status: 'unbilled',
    notes: 'Drafting Special Conditions and Deed of Indemnity for vendor execution.'
  },
  {
    id: 'te-4',
    matterId: 'm-3',
    matterNumber: 'LF/2026/031',
    matterTitle: 'Dr. Florence Muthoni v. St. Jude Hospital',
    advocateId: 'u-3',
    advocateName: 'David Kiprop Cheruiyot',
    activity: 'Client Meeting',
    hours: 1.5,
    hourlyRate: 18000,
    billable: true,
    date: '2026-09-22',
    status: 'unbilled',
    notes: 'Conference with client and independent surgical expert to review quantum of damages.'
  }
];

export const INITIAL_COMMUNICATIONS: CommunicationLog[] = [
  {
    id: 'comm-1',
    matterId: 'm-1',
    matterNumber: 'LF/2026/014',
    matterTitle: 'ABC Limited v. XYZ Logistics',
    type: 'Phone Call',
    date: '2026-09-28',
    time: '10:45 AM',
    sender: 'Phosta Colliner, SC',
    recipient: 'Peter Munene (MD - ABC Ltd)',
    summary: 'Briefed client on hearing tomorrow at 9:00 AM. Confirmed attendance of witness Mr. Oduor.',
    actionRequired: 'Ensure witness arrives at Chambers by 8:00 AM for pre-trial walk-through.'
  },
  {
    id: 'comm-2',
    matterId: 'm-1',
    matterNumber: 'LF/2026/014',
    matterTitle: 'ABC Limited v. XYZ Logistics',
    type: 'Email',
    date: '2026-09-26',
    time: '04:15 PM',
    sender: 'Mohammed & Muigai Advocates',
    recipient: 'Phosta Colliner, SC',
    summary: 'Opposing counsel forwarding scanned copy of their Supplementary List of Documents.',
    actionRequired: 'Review items 4 and 5 in the bundle for evidentiary objections.'
  },
  {
    id: 'comm-3',
    matterId: 'm-2',
    matterNumber: 'LF/2026/022',
    matterTitle: 'Purchase of LR No. 209/14250/8',
    type: 'WhatsApp',
    date: '2026-09-24',
    time: '02:30 PM',
    sender: 'Eng. Francis Gichuru (Client)',
    recipient: 'Jane Wanjiku Kamau',
    summary: 'Client inquiring on timeline for ArdhiSasisha valuer inspection certificate approval.',
    actionRequired: 'Clerk Brian to follow up with Ministry of Lands Valuer.'
  }
];

export const INITIAL_CONVEYANCING_WORKFLOW: WorkflowStage[] = [
  {
    id: 'ws-1',
    order: 1,
    name: 'Client Intake & KYC',
    description: 'Collect ID/Passport, KRA PIN, Certificate of Incorporation, Conflict clearance',
    status: 'completed',
    responsibleRole: 'Partner / Reception',
    completedDate: '2026-02-15',
    requiredDocuments: ['Client Registration Form', 'KRA PIN Certificate', 'CR12 Company Search']
  },
  {
    id: 'ws-2',
    order: 2,
    name: 'Document Collection',
    description: 'Receive copies of title deed, vendor identification, mutation forms',
    status: 'completed',
    responsibleRole: 'Associate Advocate',
    completedDate: '2026-02-18',
    requiredDocuments: ['Copy of Title Deed', 'Vendor ID/PIN', 'Land Rates Clearance']
  },
  {
    id: 'ws-3',
    order: 3,
    name: 'Due Diligence & Investigation',
    description: 'Investigate vendor root of title, historical ownership, gazette notices',
    status: 'completed',
    responsibleRole: 'Lead Advocate',
    completedDate: '2026-02-22',
    requiredDocuments: ['Historical Title Trace', 'Survey Plan verification']
  },
  {
    id: 'ws-4',
    order: 4,
    name: 'Official Lands Search',
    description: 'Perform search on ArdhiSasisha and verify absence of encumbrances or caveats',
    status: 'completed',
    responsibleRole: 'Legal Clerk',
    completedDate: '2026-02-25',
    requiredDocuments: ['Official Search Certificate (ArdhiSasisha)']
  },
  {
    id: 'ws-5',
    order: 5,
    name: 'Sale Agreement Drafting & Negotiation',
    description: 'Prepare terms, stakeholder clauses, 10% deposit terms and completion date',
    status: 'completed',
    responsibleRole: 'Partner',
    completedDate: '2026-03-01',
    requiredDocuments: ['Draft Sale Agreement', 'Vendor Counsel Comments']
  },
  {
    id: 'ws-6',
    order: 6,
    name: 'Execution & Deposit Stakeholder',
    description: 'Parties sign agreement; 10% deposit banked into firm Trust Account',
    status: 'completed',
    responsibleRole: 'Managing Partner',
    completedDate: '2026-03-05',
    requiredDocuments: ['Executed Sale Agreement', 'Trust Bank Receipt Slip']
  },
  {
    id: 'ws-7',
    order: 7,
    name: 'Stamp Duty Valuation & Assessment',
    description: 'Government Valuer site inspection and KRA Stamp Duty PRN generation',
    status: 'current',
    responsibleRole: 'Legal Clerk',
    requiredDocuments: ['Government Valuer Report', 'Stamp Duty PRN Assessment Slip']
  },
  {
    id: 'ws-8',
    order: 8,
    name: 'Transfer Instruments Execution',
    description: 'Execution of Transfer Form, Rates Clearance, Land Rent clearance receipt',
    status: 'upcoming',
    responsibleRole: 'Lead Advocate',
    requiredDocuments: ['Transfer of Land Form', 'Rates Clearance Certificate', 'Land Rent Certificate']
  },
  {
    id: 'ws-9',
    order: 9,
    name: 'Registration at Lands Registry',
    description: 'Lodge transfer for final booking, presentation and issuance of new Title',
    status: 'upcoming',
    responsibleRole: 'Legal Clerk',
    requiredDocuments: ['Original Title Deed', 'Duly Stamped Transfer Instrument']
  },
  {
    id: 'ws-10',
    order: 10,
    name: 'Matter Closure & Funds Release',
    description: 'Release balance of purchase price to Vendor, deliver Title to Client, close matter file',
    status: 'upcoming',
    responsibleRole: 'Managing Partner',
    requiredDocuments: ['Original Title issued to Purchaser', 'Completion Statement', 'Discharge Notice']
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'al-1',
    timestamp: '2026-09-28 10:45 AM',
    userName: 'Phosta Colliner, SC',
    userRole: 'Managing Partner',
    action: 'Logged Communication',
    targetType: 'Matter',
    targetId: 'LF/2026/014',
    details: 'Logged pre-trial conference call with client MD Peter Munene.'
  },
  {
    id: 'al-2',
    timestamp: '2026-09-28 09:15 AM',
    userName: 'Phosta Colliner, SC',
    userRole: 'Managing Partner',
    action: 'Task Updated',
    targetType: 'Task',
    targetId: 'tsk-1',
    details: 'Updated status to In Progress for hearing preparation bundle.'
  },
  {
    id: 'al-3',
    timestamp: '2026-09-27 04:30 PM',
    userName: 'Brian Mutua',
    userRole: 'Legal Clerk',
    action: 'Task Completed',
    targetType: 'Task',
    targetId: 'tsk-2',
    details: 'Uploaded certified bank statements exhibit.'
  },
  {
    id: 'al-4',
    timestamp: '2026-09-25 03:00 PM',
    userName: 'Beatrice Ndinda, CPA-K',
    userRole: 'Accounts',
    action: 'Trust Account Audited',
    targetType: 'Trust Ledger',
    targetId: 'TR-2026-0025',
    details: 'Verified KRA stamp duty PRN reconciliation for LR 209/14250/8.'
  },
  {
    id: 'al-5',
    timestamp: '2026-09-20 11:20 AM',
    userName: 'Jane Wanjiku Kamau',
    userRole: 'Partner',
    action: 'Conflict Check Run',
    targetType: 'Client Intake',
    targetId: 'c-6',
    details: 'Scanned Apex Holdings Kenya Limited against opposing parties database.'
  }
];
