import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SidebarProvider } from '@/components/ui-kit/sidebar';
import { LoadingOverlay } from '@/components/core';
import { DashboardPage } from '@/modules/dashboard';
import { FinancePage } from '@/modules/finance';
import { CalendarPage } from '@/modules/big-calendar';
import { EmailPage } from '@/modules/email';
import { ChatPage } from '@/modules/chat';
import { NotFoundPage, ServiceUnavailablePage } from '@/modules/error-view';
import { FileManagerMyFilesPage, SharedWithMePage, TrashPage } from '@/modules/file-manager';
import { ActivityLogPage, TimelinePage } from '@/modules/activity-log';
import { InventoryPage, InventoryDetailsPage, InventoryFormPage } from '@/modules/inventory';
import {
  InvoicesPage,
  InvoiceDetailsPage,
  CreateInvoicePage,
  EditInvoicePage,
} from '@/modules/invoices';
import { TaskManagerPage } from '@/modules/task-manager';
import { ProfilePage } from '@/modules/profile';
import { UsersTablePage } from '@/modules/iam';
import { MainLayout } from '@/layout/main-layout/main-layout';
import { Toaster } from '@/components/ui-kit/toaster';
import { ClientMiddleware } from '@/state/client-middleware';
import { ThemeProvider } from '@/styles/theme/theme-provider';
import './i18n/i18n';
import { AuthRoutes } from './routes/auth.route';
import { useLanguageContext, LanguageProvider } from './i18n/language-context';

const queryClient = new QueryClient();

function AppContent() {
  const { isLoading } = useLanguageContext();

  if (isLoading) {
    return <LoadingOverlay />;
  }

  return (
    <div className="min-h-screen bg-background font-sans antialiased relative">
      <ClientMiddleware>
        <ThemeProvider>
          <SidebarProvider>
            <Routes>
              {AuthRoutes}
              <Route element={<MainLayout />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/finance" element={<FinancePage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/inventory" element={<InventoryPage />} />
                <Route path="/inventory/add" element={<InventoryFormPage />} />
                <Route path="/inventory/:itemId" element={<InventoryDetailsPage />} />

                <Route path="/activity-log" element={<ActivityLogPage />} />
                <Route path="/timeline" element={<TimelinePage />} />
                <Route path="/mail" element={<EmailPage />} />
                <Route path="/mail/:category" element={<EmailPage />} />
                <Route path="/mail/:category/:emailId" element={<EmailPage />} />
                <Route path="/mail/:category/:labels/:emailId" element={<EmailPage />} />
                <Route path="/identity-management" element={<UsersTablePage />} />
                <Route path="/task-manager" element={<TaskManagerPage />} />
                <Route path="/chat" element={<ChatPage />} />
                {/* 
                To implement permissions for feature Invoices

                <Route
                  path="/invoices"
                  element={
                    <PermissionGuard
                      permissions={[MENU_PERMISSIONS.INVOICE_READ, MENU_PERMISSIONS.INVOICE_WRITE]}
                      fallbackType="dialog"
                    >
                      <InvoicesPage />
                    </PermissionGuard>
                  }
                />

                <Route
                  path="/invoices/create-invoice"
                  element={
                    <PermissionGuard
                      permissions={[MENU_PERMISSIONS.INVOICE_WRITE]}
                      fallbackType="dialog"
                    >
                      <CreateInvoice />
                    </PermissionGuard>
                  }
                />

                <Route
                  path="/invoices/:invoiceId/edit"
                  element={
                    <PermissionGuard
                      permissions={[MENU_PERMISSIONS.INVOICE_WRITE]}
                      fallbackType="dialog"
                    >
                      <EditInvoice />
                    </PermissionGuard
                  }
                />
                */}

                <Route path="/invoices" element={<InvoicesPage />} />
                <Route path="/invoices/create-invoice" element={<CreateInvoicePage />} />
                <Route path="/invoices/:invoiceId/edit" element={<EditInvoicePage />} />

                <Route path="/invoices/:invoiceId" element={<InvoiceDetailsPage />} />
                <Route path="/file-manager/my-files" element={<FileManagerMyFilesPage />} />
                <Route path="/file-manager/shared-files" element={<SharedWithMePage />} />
                <Route path="/file-manager/trash" element={<TrashPage />} />
                <Route
                  path="/file-manager/my-files/:folderId"
                  element={<FileManagerMyFilesPage />}
                />
                <Route path="/file-manager/shared-files/:folderId" element={<SharedWithMePage />} />
                <Route path="/file-manager/trash/:folderId" element={<TrashPage />} />

                <Route path="/calendar" element={<CalendarPage />} />
                <Route path="/503" element={<ServiceUnavailablePage />} />
                <Route path="/404" element={<NotFoundPage />} />
              </Route>

              {/* redirecting */}
              <Route path="/" element={<Navigate to="/dashboard" />} />
              <Route path="/file-manager" element={<Navigate to="/file-manager/my-files" />} />
              <Route path="/my-files" element={<Navigate to="/file-manager/my-files" />} />
              <Route path="/shared-files" element={<Navigate to="/file-manager/shared-files" />} />
              <Route path="/trash" element={<Navigate to="/file-manager/trash" />} />

              <Route path="*" element={<Navigate to="/404" />} />
            </Routes>
          </SidebarProvider>
        </ThemeProvider>
      </ClientMiddleware>
      <Toaster />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <LanguageProvider defaultLanguage="en-US" defaultModules={['common', 'auth']}>
          <AppContent />
        </LanguageProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;
