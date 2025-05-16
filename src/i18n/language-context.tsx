import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { loadTranslations } from './i18n';
import {
  useAvailableLanguages,
  useAvailableModules,
} from 'components/blocks/language-selector/hooks/use-language';
import { routeModuleMap } from './route-module-map';

/**
 * Type definition for the Language Context.
 * Provides language-related state and functionality throughout the application.
 *
 * @interface LanguageContextType
 */
interface LanguageContextType {
  currentLanguage: string;
  setLanguage: (language: string) => Promise<void>;
  isLoading: boolean;
  availableLanguages: any[];
  availableModules: any[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

/**
 * Props for the LanguageProvider component.
 *
 * @interface LanguageProviderProps
 */
interface LanguageProviderProps {
  children: ReactNode;
  defaultLanguage?: string;
  defaultModules?: string[];
}

/**
 * Cache to store loaded translation modules for each language
 * Structure: { [language: string]: Set<string> }
 */
const translationCache: Record<string, Set<string>> = {};

export const LanguageProvider: React.FC<LanguageProviderProps> = ({
  children,
  defaultLanguage = 'en-US',
  defaultModules = ['common', 'auth'],
}) => {
  const location = useLocation();
  const [currentLanguage, setCurrentLanguage] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('language') || defaultLanguage;
    }
    return defaultLanguage;
  });

  const [isLoading, setIsLoading] = useState(true);
  const { i18n } = useTranslation();
  const { data: languages = [] } = useAvailableLanguages();
  const { data: modules = [] } = useAvailableModules();

  /**
 * Extracts the base route from a pathname.
 * E.g., '/dashboard/settings' -> '/dashboard'
 *
 * @param {string} pathname - The full pathname from the router
 * @returns {string} The base route path
 */
const getBaseRoute = (pathname: string): string => {
    const segments = pathname.split('/').filter(Boolean);
    return '/' + (segments[0] || '');
  };

  /**
 * Loads translation modules for a given language and route.
 * Determines required modules based on the current route and loads their translations.
 *
 * @param {string} language - Language code to load translations for
 * @param {string} pathname - Current route pathname
 * @returns {Promise<void>} Resolves when all modules are loaded
 */
/**
 * Checks if all required modules for a route are cached
 */
const areModulesCached = (language: string, modules: string[]): boolean => {
    if (!translationCache[language]) return false;
    return modules.every(module => translationCache[language].has(module));
};

/**
 * Adds loaded modules to the cache
 */
const cacheModules = (language: string, modules: string[]): void => {
    if (!translationCache[language]) {
        translationCache[language] = new Set();
    }
    modules.forEach(module => translationCache[language].add(module));
};

const loadLanguageModules = async (language: string, pathname: string) => {
    const baseRoute = getBaseRoute(pathname);
    const matchedModules = routeModuleMap[baseRoute] || defaultModules;

    // Skip loading if all modules are already cached
    if (areModulesCached(language, matchedModules)) {
        return;
    }

    for (const moduleName of matchedModules) {
        try {
            // Only load if not cached
            if (!translationCache[language]?.has(moduleName)) {
                await loadTranslations(language, moduleName);
                // Add to cache after successful load
                cacheModules(language, [moduleName]);
            }
        } catch (err) {
            console.error(`Failed to load translations for module ${moduleName}:`, err);
        }
    }
  };

  /**
 * Changes the application's active language.
 * - Persists the language choice to localStorage
 * - Loads required translation modules
 * - Updates i18n instance and context state
 *
 * @param {string} language - The language code to switch to
 * @returns {Promise<void>} Resolves when language change is complete
 */
const setLanguage = async (language: string): Promise<void> => {
    setIsLoading(true);
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('language', language);
      }

      await loadLanguageModules(language, location.pathname);
      i18n.changeLanguage(language);
      setCurrentLanguage(language);
    } catch (error) {
      console.error('Failed to change language:', error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
 * Effect hook to initialize translations when the component mounts.
 * Loads initial translation modules and sets up the language.
 */
useEffect(() => {
    const initializeTranslations = async () => {
      setIsLoading(true);
      try {
        await loadLanguageModules(currentLanguage, location.pathname);
        i18n.changeLanguage(currentLanguage);
      } catch (error) {
        console.error('Failed to initialize translations:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeTranslations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
 * Effect hook to handle route changes.
 * Loads required translation modules when the route or language changes.
 */
useEffect(() => {
    const loadOnRouteChange = async () => {
      const baseRoute = getBaseRoute(location.pathname);
      const matchedModules = routeModuleMap[baseRoute] || defaultModules;
      
      // Only show loading state if modules aren't cached
      if (!areModulesCached(currentLanguage, matchedModules)) {
        setIsLoading(true);
      }
      
      try {
        await loadLanguageModules(currentLanguage, location.pathname);
      } catch (err) {
        console.error('Failed to load modules on route change:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadOnRouteChange();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLanguage, location.pathname]);

  const value = {
    currentLanguage,
    setLanguage,
    isLoading,
    availableLanguages: languages,
    availableModules: modules,
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguageContext = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguageContext must be used within a LanguageProvider');
  }
  return context;
};
