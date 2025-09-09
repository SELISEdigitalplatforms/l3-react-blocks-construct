import { useLanguageContext, LanguageProvider } from './i18n/language-context';
import { LoadingOverlay } from './components/core/loading-overlay';
import './i18n/i18n';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'components/ui/toaster';
import { ClientMiddleware } from 'state/client-middleware';
import MainLayout from 'pages/main/main-layout';
import { AuthLayout } from './features/core/auth/pages/auth-layout';
import { SigninPage } from './features/core/auth/pages/signin/signin-page';
import { SignupPage } from './features/core/auth/pages/signup/signup-page';
import { EmailVerification } from './features/core/auth/pages/email-verification/email-verification';
import { SetPasswordPage } from './features/core/auth/pages/set-password/set-password';
import { ActivationSuccess } from './features/core/auth/pages/activation-success/activation-success';
import { VerificationFailed } from './features/core/auth/pages/verification-failed/verification-failed';
import { ResetPasswordPage } from './features/core/auth/pages/reset-password/reset-password';
import { ForgotPasswordPage } from './features/core/auth/pages/forgot-password/forgot-password';
import { Profile } from './features/core/profile/pages/profile';
import { Storage } from './pages/services/storage/storage';
import { Mail } from './pages/services/mail/mail';
import { Help } from './pages/help/help';
import { ThemeProvider } from 'styles/theme/theme-provider';
import { SidebarProvider } from 'components/ui/sidebar';
import { VerifyOtpKey } from './features/core/auth/pages/verify-otp-key/verify-otp-key';
import { DynamicRoutes } from './components/dynamic-routes';

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
                {/* Dynamic routes based on selected menu items */}
                <Route path="/*" element={<DynamicRoutes />} />
                
                {/* Static routes that are always available */}
                <Route path="/profile" element={<Profile />} />
                <Route path="/help" element={<Help />} />
                <Route path="/services/storage" element={<Storage />} />
                <Route path="/services/mail" element={<Mail />} />
              </Route>

              {/* redirecting - handled by DynamicRoutes component */}
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
