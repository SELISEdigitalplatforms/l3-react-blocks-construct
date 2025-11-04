import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SidebarProvider } from '@/components/ui-kit/sidebar';
import { LoadingOverlay } from '@/components/core';
import { MainLayout } from '@/layout/main-layout/main-layout';
import { Toaster } from '@/components/ui-kit/toaster';
import { ClientMiddleware } from '@/state/client-middleware';
import { ThemeProvider } from '@/styles/theme/theme-provider';
import './i18n/i18n';
import { AuthRoutes } from './routes/auth.route';
import { useLanguageContext, LanguageProvider } from './i18n/language-context';
import { Guard } from './state/store/auth/guard';

const DashboardPage = lazy(() =>
  import('@/modules/dashboard').then((m) => ({ default: m.DashboardPage }))
);
const FinancePage = lazy(() =>
  import('@/modules/finance').then((m) => ({ default: m.FinancePage }))
);
const CalendarPage = lazy(() =>
  import('@/modules/big-calendar').then((m) => ({ default: m.CalendarPage }))
);
const EmailPage = lazy(() => import('@/modules/email').then((m) => ({ default: m.EmailPage })));
const ChatPage = lazy(() => import('@/modules/chat').then((m) => ({ default: m.ChatPage })));
const NotFoundPage = lazy(() =>
  import('@/modules/error-view').then((m) => ({ default: m.NotFoundPage }))
);
const ServiceUnavailablePage = lazy(() =>
  import('@/modules/error-view').then((m) => ({ default: m.ServiceUnavailablePage }))
);
const FileManagerMyFilesPage = lazy(() =>
  import('@/modules/file-manager').then((m) => ({ default: m.FileManagerMyFilesPage }))
);
const SharedWithMePage = lazy(() =>
  import('@/modules/file-manager').then((m) => ({ default: m.SharedWithMePage }))
);
const TrashPage = lazy(() =>
  import('@/modules/file-manager').then((m) => ({ default: m.TrashPage }))
);
const ActivityLogPage = lazy(() =>
  import('@/modules/activity-log').then((m) => ({ default: m.ActivityLogPage }))
);
const TimelinePage = lazy(() =>
  import('@/modules/activity-log').then((m) => ({ default: m.TimelinePage }))
);
const InventoryPage = lazy(() =>
  import('@/modules/inventory').then((m) => ({ default: m.InventoryPage }))
);
const InventoryDetailsPage = lazy(() =>
  import('@/modules/inventory').then((m) => ({ default: m.InventoryDetailsPage }))
);
const InventoryFormPage = lazy(() =>
  import('@/modules/inventory').then((m) => ({ default: m.InventoryFormPage }))
);
const InvoicesPage = lazy(() =>
  import('@/modules/invoices').then((m) => ({ default: m.InvoicesPage }))
);
const InvoiceDetailsPage = lazy(() =>
  import('@/modules/invoices').then((m) => ({ default: m.InvoiceDetailsPage }))
);
const CreateInvoicePage = lazy(() =>
  import('@/modules/invoices').then((m) => ({ default: m.CreateInvoicePage }))
);
const EditInvoicePage = lazy(() =>
  import('@/modules/invoices').then((m) => ({ default: m.EditInvoicePage }))
);
const TaskManagerPage = lazy(() =>
  import('@/modules/task-manager').then((m) => ({ default: m.TaskManagerPage }))
);
const ProfilePage = lazy(() =>
  import('@/modules/profile').then((m) => ({ default: m.ProfilePage }))
);
const UsersTablePage = lazy(() =>
  import('@/modules/iam').then((m) => ({ default: m.UsersTablePage }))
);

const queryClient = new QueryClient();

const AppContent = () => {
  const { isLoading } = useLanguageContext();

  if (isLoading) {
    return <LoadingOverlay />;
  }

  return (
    <div className="min-h-screen bg-background font-sans antialiased relative">
      <ClientMiddleware>
        <ThemeProvider>
          <SidebarProvider>
            <Suspense fallback={<LoadingOverlay />}>
              <Routes>
                {AuthRoutes}
                {/* <Route element={<AuthLayout />}>
                <Route path="/login" element={<SigninPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/sent-email" element={<EmailVerification />} />
                <Route path="/activate" element={<SetPasswordPage />} />
                <Route path="/resetpassword" element={<ResetPasswordPage />} />
                <Route path="/success" element={<ActivationSuccess />} />
                <Route path="/activate-failed" element={<VerificationFailed />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/verify-key" element={<VerifyOtpKey />} />
              </Route> */}

                <Route
                  element={
                    <Guard>
                      <MainLayout />
                    </Guard>
                  }
                >
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
                  <Route
                    path="/file-manager/shared-files/:folderId"
                    element={<SharedWithMePage />}
                  />
                  <Route path="/file-manager/trash/:folderId" element={<TrashPage />} />

                  <Route path="/calendar" element={<CalendarPage />} />
                  <Route path="/503" element={<ServiceUnavailablePage />} />
                  <Route path="/404" element={<NotFoundPage />} />
                </Route>

                {/* redirecting */}
                <Route path="/" element={<Navigate to="/dashboard" />} />
                <Route path="/file-manager" element={<Navigate to="/file-manager/my-files" />} />
                <Route path="/my-files" element={<Navigate to="/file-manager/my-files" />} />
                <Route
                  path="/shared-files"
                  element={<Navigate to="/file-manager/shared-files" />}
                />
                <Route path="/trash" element={<Navigate to="/file-manager/trash" />} />
                <Route path="*" element={<Navigate to="/404" />} />
              </Routes>
            </Suspense>
          </SidebarProvider>
        </ThemeProvider>
      </ClientMiddleware>
      <Toaster />
    </div>
  );
};

export const App = () => {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <LanguageProvider defaultLanguage="en-US" defaultModules={['common', 'auth']}>
          <AppContent />
        </LanguageProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
};
