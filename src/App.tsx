import { useEffect } from 'react';
import { useLanguageContext, LanguageProvider } from './i18n/language-context';
import { LoadingOverlay } from './components/core/loading-overlay';
import './i18n/i18n';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'components/ui/toaster';
import { ClientMiddleware } from 'state/client-middleware';
import MainLayout from 'pages/main/main-layout';
import { AuthLayout } from './pages/auth/auth-layout';
import { SigninPage } from 'pages/auth/signin/signin-page';
import { SignupPage } from 'pages/auth/signup/signup-page';
import { EmailVerification } from 'pages/auth/email-verification/email-verification';
import { Dashboard } from 'pages/main/dashboard/dashboard';
import { SetPasswordPage } from './pages/auth/set-password/set-password';
import { ActivationSuccess } from './pages/auth/activation-success/activation-success';
import { VerificationFailed } from './pages/auth/verification-failed/verification-failed';
import { ResetPasswordPage } from './pages/auth/reset-password/reset-password';
import { ForgotPasswordPage } from './pages/auth/forgot-password/forgot-password';
import TaskPage from './pages/main/iam-table';
import { Profile } from './pages/profile/profile';
import { Storage } from './pages/services/storage/storage';
import { Mail } from './pages/services/mail/mail';
import { Help } from './pages/help/help';
import { ThemeProvider } from './components/core/theme-provider';
import { Inventory } from './pages/inventory/inventory';
import { InventoryDetails } from './pages/inventory/inventory-details';
import { SidebarProvider } from 'components/ui/sidebar';
import { Email } from './pages/email/email';
import { VerifyOtpKey } from './pages/auth/verify-otp-key/verify-otp-key';
import { InventoryForm } from './features/inventory/component/inventory-form/inventory-form';
import TaskManager from './pages/task-manager/task-manager';
import ActivityLogPage2 from './pages/activity-log-v2/activity-log';
import ActivityLogPage1 from './pages/activity-log-v1/activity-log';
import { CalendarPage } from './pages/calendar/calendar';
import ServiceUnavailable from './pages/error/service-unavailable/service-unavailable';
import NotFound from './pages/error/not-found/not-found';
import Finance from './pages/finance/finance';
import { InvoicesPage } from './pages/invoices/invoices';
import { InvoiceDetailsPage } from './pages/invoices/invoices-detail';
import { InvoiceLayout } from './pages/invoices/invoice-layout';
import { CreateInvoice, EditInvoice } from './features/invoices';
import SharedWithMe from 'pages/file-manager/shared-files';
import Trash from 'pages/file-manager/trash';
import { ChatPage } from './pages/chat/chat';
import { FileManagerMyFiles } from './pages/file-manager/my-files';

const queryClient = new QueryClient();

function RedirectHandler() {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/success') {
      const headers = new Headers();
      headers.set('x-current-path', location.pathname);

      setTimeout(() => {
        window.location.href = '/';
      }, 10000);
    }
  }, [location]);

  return null;
}

function AppContent() {
  const { isLoading } = useLanguageContext();

  if (isLoading) {
    return <LoadingOverlay />;
  }

  return (
    <div className="min-h-screen bg-background font-sans antialiased relative">
      <RedirectHandler />
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
                <Route path="/activity-log" element={<ActivityLogPage1 />} />
                <Route path="/timeline" element={<ActivityLogPage2 />} />
                <Route path="/mail" element={<Email />} />
                <Route path="/mail/:category" element={<Email />} />
                <Route path="/mail/:category/:emailId" element={<Email />} />
                <Route path="/mail/:category/:labels/:emailId" element={<Email />} />
                <Route path="/help" element={<Help />} />
                <Route path="/identity-management" element={<TaskPage />} />
                <Route path="/services/storage" element={<Storage />} />
                <Route path="/services/mail" element={<Mail />} />
                <Route path="/task-manager" element={<TaskManager />} />
                <Route path="/chat" element={<ChatPage />} />
                <Route element={<InvoiceLayout />}>
                  <Route path="/invoices" element={<InvoicesPage />} />
                  <Route path="/invoices/create-invoice" element={<CreateInvoice />} />
                  <Route path="/invoices/edit/:invoiceId" element={<EditInvoice />} />
                  <Route path="/invoices/:invoiceId" element={<InvoiceDetailsPage />} />
                </Route>
                <Route path="/file-manager/my-files" element={<FileManagerMyFiles />} />
                <Route path="/file-manager/shared-files" element={<SharedWithMe />} />
                <Route path="/file-manager/trash" element={<Trash />} />

                <Route path="/calendar" element={<CalendarPage />} />
                <Route path="/503" element={<ServiceUnavailable />} />
                <Route path="/404" element={<NotFound />} />
              </Route>

              {/* redirecting */}
              <Route path="/" element={<Navigate to="/dashboard" />} />
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
