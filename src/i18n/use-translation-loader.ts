import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { loadTranslations } from './i18n';
import { useAvailableModules } from '@/components/core/language-selector/hooks/use-language';

/**
 * Custom hook to load translations for the current language and module
 *
 * This hook manages loading translations from the API and updating the i18n instance
 * when the language or module changes. It returns the t function from react-i18next
 * for use in components.
 *
 * @param language - The current language code
 * @param moduleName - Optional module name, defaults to 'common'
 * @returns Object containing translation function and loading state
 *
 * @example
 * const { t, isLoading } = useTranslationLoader('en-US', 'dashboard');
 * return isLoading ? <Spinner /> : <div>{t('welcome')}</div>;
 */
export const useTranslationLoader = (language: string, moduleName = 'common') => {
  const { t, i18n } = useTranslation();
  useEffect(() => {
    i18n.loadNamespaces(moduleName);
  }, [i18n, moduleName]);
  const [isLoading, setIsLoading] = useState(true);
  const { data: modules } = useAvailableModules();

  useEffect(() => {
    const loadTranslationsForModule = async () => {
      setIsLoading(true);
      try {
        if (modules && !modules.some((m) => m.moduleName === moduleName)) {
          console.warn(`Module "${moduleName}" not found. Using default module.`);
        }

        await loadTranslations(language, moduleName);
      } catch (error) {
        console.error('Error loading translations:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTranslationsForModule();
  }, [language, moduleName, modules]);

  return { t, isLoading, i18n };
};

export default useTranslationLoader;
