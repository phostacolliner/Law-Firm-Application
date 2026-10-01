/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { FirmDashboard } from './components/dashboard/FirmDashboard';
import { ClientManager } from './components/clients/ClientManager';
import { MatterManager } from './components/matters/MatterManager';
import { CourtDiary } from './components/diary/CourtDiary';
import { DocumentManager } from './components/documents/DocumentManager';
import { TaskManager } from './components/tasks/TaskManager';
import { WorkflowEngine } from './components/workflows/WorkflowEngine';
import { BillingManager } from './components/billing/BillingManager';
import { TrustAccounting } from './components/trust/TrustAccounting';
import { FirmAccounting } from './components/accounting/FirmAccounting';
import { TimeTracker } from './components/timetracking/TimeTracker';
import { AiLegalAssistant } from './components/ai/AiLegalAssistant';
import { ConflictChecker } from './components/conflicts/ConflictChecker';
import { AuditTrailViewer } from './components/audit/AuditTrailViewer';
import { ClientPortal } from './components/portal/ClientPortal';
import { DeploymentResetManager } from './components/deployment/DeploymentResetManager';
import { SectorReportsHub } from './components/reports/SectorReportsHub';

// Modals
import { GlobalSearchModal } from './components/modals/GlobalSearchModal';
import { NewMatterModal } from './components/modals/NewMatterModal';
import { NewClientModal } from './components/modals/NewClientModal';
import { NewCourtEventModal } from './components/modals/NewCourtEventModal';
import { NewInvoiceModal } from './components/modals/NewInvoiceModal';
import { RecordPaymentModal } from './components/modals/RecordPaymentModal';
import { NewDocumentModal } from './components/modals/NewDocumentModal';
import { NewTaskModal } from './components/modals/NewTaskModal';

const MainAppContent: React.FC = () => {
  const { activeTab, currentRole } = useApp();

  // Modal Visibility States
  const [isNewMatterOpen, setIsNewMatterOpen] = useState(false);
  const [isNewClientOpen, setIsNewClientOpen] = useState(false);
  const [isNewCourtEventOpen, setIsNewCourtEventOpen] = useState(false);
  const [selectedCourtMatterId, setSelectedCourtMatterId] = useState<string | undefined>(undefined);
  const [isNewInvoiceOpen, setIsNewInvoiceOpen] = useState(false);
  const [isRecordPaymentOpen, setIsRecordPaymentOpen] = useState(false);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string>('');
  const [isNewDocOpen, setIsNewDocOpen] = useState(false);
  const [selectedDocMatterId, setSelectedDocMatterId] = useState<string | undefined>(undefined);
  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 font-sans overflow-hidden antialiased">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <Header 
          onOpenNewMatter={() => setIsNewMatterOpen(true)}
          onOpenNewClient={() => setIsNewClientOpen(true)}
        />

        {/* Dynamic Page Router Area */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 bg-slate-950/70">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'dashboard' && <FirmDashboard />}
            {activeTab === 'clients' && <ClientManager onOpenNewClient={() => setIsNewClientOpen(true)} />}
            {activeTab === 'matters' && (
              <MatterManager 
                onOpenNewMatter={() => setIsNewMatterOpen(true)}
                onOpenNewCourtEvent={(mId) => {
                  setSelectedCourtMatterId(mId);
                  setIsNewCourtEventOpen(true);
                }}
                onOpenNewDocument={(mId) => {
                  setSelectedDocMatterId(mId);
                  setIsNewDocOpen(true);
                }}
              />
            )}
            {activeTab === 'diary' && (
              <CourtDiary 
                onOpenNewCourtEvent={(mId) => {
                  setSelectedCourtMatterId(mId);
                  setIsNewCourtEventOpen(true);
                }}
              />
            )}
            {activeTab === 'documents' && (
              <DocumentManager onOpenNewDocument={() => setIsNewDocOpen(true)} />
            )}
            {activeTab === 'tasks' && (
              <TaskManager onOpenNewTask={() => setIsNewTaskOpen(true)} />
            )}
            {activeTab === 'workflows' && <WorkflowEngine />}
            {activeTab === 'billing' && (
              <BillingManager 
                onOpenNewInvoice={() => setIsNewInvoiceOpen(true)}
                onOpenRecordPayment={(invId) => {
                  setSelectedInvoiceId(invId);
                  setIsRecordPaymentOpen(true);
                }}
              />
            )}
            {activeTab === 'trust' && <TrustAccounting />}
            {activeTab === 'firm-accounting' && <FirmAccounting />}
            {activeTab === 'time-tracker' && <TimeTracker />}
            {activeTab === 'reports' && <SectorReportsHub />}
            {activeTab === 'ai-assistant' && <AiLegalAssistant />}
            {activeTab === 'conflicts' && <ConflictChecker />}
            {activeTab === 'audit-trail' && <AuditTrailViewer />}
            {activeTab === 'deployment' && <DeploymentResetManager />}
            {activeTab === 'client-portal' && <ClientPortal />}
          </div>
        </main>
      </div>

      {/* Global Modals */}
      <GlobalSearchModal />
      
      <NewMatterModal 
        isOpen={isNewMatterOpen} 
        onClose={() => setIsNewMatterOpen(false)} 
      />

      <NewClientModal 
        isOpen={isNewClientOpen} 
        onClose={() => setIsNewClientOpen(false)} 
      />

      <NewCourtEventModal 
        isOpen={isNewCourtEventOpen} 
        onClose={() => {
          setIsNewCourtEventOpen(false);
          setSelectedCourtMatterId(undefined);
        }}
        defaultMatterId={selectedCourtMatterId}
      />

      <NewInvoiceModal 
        isOpen={isNewInvoiceOpen} 
        onClose={() => setIsNewInvoiceOpen(false)} 
      />

      <RecordPaymentModal 
        isOpen={isRecordPaymentOpen} 
        onClose={() => setIsRecordPaymentOpen(false)}
        invoiceId={selectedInvoiceId}
      />

      <NewDocumentModal 
        isOpen={isNewDocOpen} 
        onClose={() => {
          setIsNewDocOpen(false);
          setSelectedDocMatterId(undefined);
        }}
        defaultMatterId={selectedDocMatterId}
      />

      <NewTaskModal 
        isOpen={isNewTaskOpen} 
        onClose={() => setIsNewTaskOpen(false)} 
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
