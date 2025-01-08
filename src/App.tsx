import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from './components/ui/toaster';
import { ClientMiddleware } from './state/client-middleware';
import { useEffect } from 'react';
// import './styles/globals.css';
import './index.css'; 

import SignIn from './features/auth/components/SignIn';
import { AuthLayout } from './pages/auth/signin/AuthLayout';

const queryClient = new QueryClient();

function RedirectHandler() {
  const location = useLocation();
  
  useEffect(() => {
    if (location.pathname === '/activate-success') {
      const headers = new Headers();
      headers.set('x-current-path', location.pathname);
      
      setTimeout(() => {
        window.location.href = '/';
      }, 100);
    }
  }, [location]);
  
  return null;
}

function AppContent() {
  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      <RedirectHandler />
      <ClientMiddleware>
        <Routes>
          <Route element={<AuthLayout />}>
            <Route path="/signin" element={<SignIn />} />
          </Route>

          <Route path="/" element={<Navigate to="/signin" />} />
          <Route path="*" element={<Navigate to="/signin" replace />} />
        </Routes>
      </ClientMiddleware>
      <Toaster />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AppContent />
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;