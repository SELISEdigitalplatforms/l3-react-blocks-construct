import { useLanguageContext, LanguageProvider } from './i18n/language-context';
import './i18n/i18n';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { ClientMiddleware } from '@/state/client-middleware';
import MainLayout from '@/pages/main/main-layout';
import { AuthLayout } from './pages/auth/auth-layout';
import { SigninPage } from '@/pages/auth/signin/signin-page';
import { SignupPage } from '@/pages/auth/signup/signup-page';
import { EmailVerification } from '@/pages/auth/email-verification/email-verification';
import { SetPasswordPage } from './pages/auth/set-password/set-password';
import { ActivationSuccess } from './pages/auth/activation-success/activation-success';
import { VerificationFailed } from './pages/auth/verification-failed/verification-failed';
import { ResetPasswordPage } from './pages/auth/reset-password/reset-password';
import { ForgotPasswordPage } from './pages/auth/forgot-password/forgot-password';
import TaskPage from './pages/main/iam-table';
import { Profile } from './pages/profile/profile';
import { ThemeProvider } from '@/styles/theme/theme-provider';
import { Inventory } from './pages/inventory/inventory';
import { InventoryDetails } from './pages/inventory/inventory-details';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Email } from '@/pages/email';
import { VerifyOtpKey } from './pages/auth/verify-otp-key/verify-otp-key';
import { InventoryForm } from './features/inventory/component/inventory-form/inventory-form';
import TaskManager from './pages/task-manager/task-manager';
import { CalendarPage } from '@/pages/calendar';
import { Finance } from '@/pages/finance';
import { InvoicesPage } from './pages/invoices/invoices';
import { InvoiceDetailsPage } from './pages/invoices/invoices-detail';
import { CreateInvoice, EditInvoice } from './features/invoices';
import { ChatPage } from '@/pages/chat';
import { Dashboard } from '@/pages/dashboard';
import { NotFound, ServiceUnavailable } from '@/pages/error';
import { ActivityLog } from '@/pages/activity-log';
import { Timeline } from '@/pages/timeline';
import { FileManagerMyFiles, SharedWithMe, Trash } from '@/pages/file-manager';
import { LoadingOverlay } from '@/components/shared';

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
              <Route element={<AuthLayout />}>
                <Route path="/login" element={<SigninPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/sent-email" element={<EmailVerification />} />
                <Route path="/activate" element={<SetPasswordPage />} />
                <Route path="/resetpassword" element={<ResetPasswordPage />} />
                <Route path="/success" element={<ActivationSuccess />} />
                <Route path="/activate-failed" element={<VerificationFailed />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/verify-key" element={<VerifyOtpKey />} />
              </Route>

              <Route element={<MainLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/finance" element={<Finance />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/inventory" element={<Inventory />} />
                <Route path="/inventory/add" element={<InventoryForm />} />
                <Route path="/inventory/:itemId" element={<InventoryDetails />} />

                <Route path="/activity-log" element={<ActivityLog />} />
                <Route path="/timeline" element={<Timeline />} />
                <Route path="/mail" element={<Email />} />
                <Route path="/mail/:category" element={<Email />} />
                <Route path="/mail/:category/:emailId" element={<Email />} />
                <Route path="/mail/:category/:labels/:emailId" element={<Email />} />
                <Route path="/identity-management" element={<TaskPage />} />
                <Route path="/task-manager" element={<TaskManager />} />
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
                <Route path="/invoices/create-invoice" element={<CreateInvoice />} />
                <Route path="/invoices/:invoiceId/edit" element={<EditInvoice />} />

                <Route path="/invoices/:invoiceId" element={<InvoiceDetailsPage />} />
                <Route path="/file-manager/my-files" element={<FileManagerMyFiles />} />
                <Route path="/file-manager/shared-files" element={<SharedWithMe />} />
                <Route path="/file-manager/trash" element={<Trash />} />
                <Route path="/file-manager/my-files/:folderId" element={<FileManagerMyFiles />} />
                <Route path="/file-manager/shared-files/:folderId" element={<SharedWithMe />} />
                <Route path="/file-manager/trash/:folderId" element={<Trash />} />

                <Route path="/calendar" element={<CalendarPage />} />
                <Route path="/503" element={<ServiceUnavailable />} />
                <Route path="/404" element={<NotFound />} />
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
