import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LanguageProvider } from './i18n/language-context';
import './i18n/i18n';
import { AppRoutes } from './routes/app-routes';

const queryClient = new QueryClient();

export default function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <LanguageProvider defaultLanguage="en-US" defaultModules={['common', 'auth']}>
          <AppRoutes />
        </LanguageProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}
