// import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import { Toaster } from './components/ui/toaster';
// import { ClientMiddleware } from './state/client-middleware';
// import { useEffect } from 'react';

// // Import your components here
// // import { AuthLayout } from './layouts/AuthLayout';
// // import { DefaultLayout } from './layouts/DefaultLayout';
// // import { SignIn } from './features/auth/SignIn';
// // import { Activate } from './features/auth/Activate';
// // import { ActivateSuccess } from './features/auth/ActivateSuccess';
// // import { Settings } from './features/settings/Settings';

// const queryClient = new QueryClient();

// function RedirectHandler() {
//     const location = useLocation();
    
//     useEffect(() => {
//       // Handle the activate-success redirect
//       if (location.pathname === '/activate-success') {
//         // We use window.history to add the current path to headers
//         const headers = new Headers();
//         headers.set('x-current-path', location.pathname);
        
//         // Redirect to home after a short delay
//         setTimeout(() => {
//           window.location.href = '/';
//         }, 100);
//       }
//     }, [location]);
  
//     return null;
//   }
  
// function App() {
//   return (
//     // <QueryClientProvider client={queryClient}>
//     //   <BrowserRouter>
//     //     <Routes>
//     //       {/* Auth Routes */}
//     //       <Route element={<AuthLayout />}>
//     //         <Route path="/signin" element={<SignIn />} />
//     //       </Route>

//     //       {/* Main Routes */}
//     //       <Route element={<DefaultLayout />}>
//     //         <Route path="/activate" element={<Activate />} />
//     //         <Route path="/activate-success" element={<ActivateSuccess />} />
//     //         <Route path="/settings" element={<Settings />} />
//     //       </Route>

//     //       {/* Default redirect */}
//     //       <Route path="*" element={<Navigate to="/signin" replace />} />
//     //     </Routes>
//     //   </BrowserRouter>
//     // </QueryClientProvider>

//     <BrowserRouter>
//       <QueryClientProvider client={queryClient}>
//         <div className="antialiased">
//           <RedirectHandler />
//           <ClientMiddleware>
//             <Routes>
//               {/* Your routes here */}
//               <Route path="/" element={<Navigate to="/signin" />} />
//               {/* Add other routes */}
//             </Routes>
//           </ClientMiddleware>
//         </div>
//         <Toaster />
//       </QueryClientProvider>
//     </BrowserRouter>
//   );
// }

// export default App;


import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from './components/ui/toaster';
import { ClientMiddleware } from './state/client-middleware';
import { useEffect } from 'react';
import './globals.css';
import './index.css';

// import SignIn from './features/auth/components/SignIn';
import { AuthLayout } from './pages/auth/signin/AuthLayout';
import { SigninPage } from './pages/auth/signin/SigninPage';

// Font declarations


// Import your components here
// import { AuthLayout } from './layouts/AuthLayout';
// import { DefaultLayout } from './layouts/DefaultLayout';
// import { Activate } from './features/auth/Activate';
// import { ActivateSuccess } from './features/auth/ActivateSuccess';
// import { Settings } from './features/settings/Settings';

const queryClient = new QueryClient();

function RedirectHandler() {
  const location = useLocation();
  
  useEffect(() => {
    // Handle the activate-success redirect
    if (location.pathname === '/activate-success') {
      // We use window.history to add the current path to headers
      const headers = new Headers();
      headers.set('x-current-path', location.pathname);
      
      // Redirect to home after a short delay
      setTimeout(() => {
        window.location.href = '/';
      }, 100);
    }
  }, [location]);
  
  return null;
}

function AppContent() {
  return (
    // <div className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
    <div>

      <RedirectHandler />
      <ClientMiddleware>
        <Routes>
          {/* Auth Routes */}
          <Route element={<AuthLayout />}>
            <Route path="/signin" element={<SigninPage />} />
          </Route>

          {/* Main Routes */}
          {/* <Route element={<DefaultLayout />}>
            <Route path="/activate" element={<Activate />} />
            <Route path="/activate-success" element={<ActivateSuccess />} />
            <Route path="/settings" element={<Settings />} />
          </Route> */}

          {/* Default redirect */}
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