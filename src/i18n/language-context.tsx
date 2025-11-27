import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useMemo,
  useCallback,
  useRef,
} from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { loadTranslations } from './i18n';
import { routeModuleMap } from './route-module-map';
import {
  useAvailableLanguages,
  useAvailableModules,
} from '@/components/core/language-selector/hooks/use-language';

/**
 * Type definition for the Language Context.
 * Provides language-related state and functionality throughout the application.
 *
 * @interface LanguageContextType
 */
interface LanguageContextType {
  currentLanguage: string;
  setLanguage: (language: string, isUserAction?: boolean) => Promise<void>;
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

export function LanguageProvider({
  children,
  defaultLanguage = 'en-US',
  defaultModules = ['common', 'auth'],
}: Readonly<LanguageProviderProps>) {
  const location = useLocation();
  // Start with a temporary language - will be updated once API default is loaded
  const [currentLanguage, setCurrentLanguage] = useState<string>(defaultLanguage);

  const [isLoading, setIsLoading] = useState(true);
  const { i18n } = useTranslation();
  const { data: languages = [], isLoading: isLanguagesLoading } = useAvailableLanguages();
  const { data: modules = [], isLoading: isModulesLoading } = useAvailableModules();
  const isInitialized = useRef(false);
  const hasCheckedDefaultLanguage = useRef(false);
  const lastApiDefaultLanguage = useRef<string | null>(null);

  useEffect(() => {
    setIsLoading(isLanguagesLoading || isModulesLoading);
  }, [isLanguagesLoading, isModulesLoading]);

  /**
   * Extracts the base route from a pathname.
   * E.g., '/dashboard/settings' -> '/dashboard'
   *
   * @param {string} pathname - The full pathname from the router
   * @returns {string} The base route path
   */
  const getBaseRoute = useCallback((pathname: string): string => {
    const segments = pathname.split('/').filter(Boolean);
    return '/' + (segments[0] || '');
  }, []);

  /**
   * Checks if all required modules for a route are cached
   */
  const areModulesCached = useCallback((language: string, modules: string[]): boolean => {
    if (!translationCache[language]) return false;
    return modules.every((module) => translationCache[language].has(module));
  }, []);

  /**
   * Adds loaded modules to the cache
   */
  const cacheModules = useCallback((language: string, modules: string[]): void => {
    if (!translationCache[language]) {
      translationCache[language] = new Set();
    }
    modules.forEach((module) => translationCache[language].add(module));
  }, []);

  /**
   * Loads translation modules for a given language and route.
   * Determines required modules based on the current route and loads their translations.
   *
   * @param {string} language - Language code to load translations for
   * @param {string} pathname - Current route pathname
   * @returns {Promise<void>} Resolves when all modules are loaded
   */
  const loadLanguageModules = useCallback(
    async (language: string, pathname: string) => {
      const baseRoute = getBaseRoute(pathname);
      const matchedModules = routeModuleMap[baseRoute] || defaultModules;

      if (areModulesCached(language, matchedModules)) {
        return;
      }

      for (const moduleName of matchedModules) {
        try {
          if (!translationCache[language]?.has(moduleName)) {
            await loadTranslations(language, moduleName);
            cacheModules(language, [moduleName]);
          }
        } catch (err) {
          console.error(`Failed to load translations for module ${moduleName}:`, err);
        }
      }
    },
    [getBaseRoute, areModulesCached, cacheModules, defaultModules]
  );

  /**
   * Changes the application's active language.
   * - Persists the language choice to localStorage
   * - Loads required translation modules
   * - Updates i18n instance and context state
   *
   * @param {string} language - The language code to switch to
   * @param {boolean} isUserAction - Whether this is triggered by user action (default: true)
   * @returns {Promise<void>} Resolves when language change is complete
   */
  const setLanguage = useCallback(
    async (language: string, isUserAction = true): Promise<void> => {
      setIsLoading(true);
      try {
        if (typeof window !== 'undefined') {
          localStorage.setItem('language', language);
          // Mark if this was an explicit user selection
          if (isUserAction) {
            localStorage.setItem('language_user_selected', 'true');
          }
        }

        await loadLanguageModules(language, location.pathname);
        i18n.changeLanguage(language);
        setCurrentLanguage(language);
        isInitialized.current = true; // Mark as initialized after language change
      } catch (error) {
        console.error('Failed to change language:', error);
      } finally {
        setIsLoading(false);
      }
    },
    [loadLanguageModules, location.pathname, i18n]
  );

  /**
   * Effect to check and apply the default language from the API.
   * This runs when languages are loaded and automatically detects when the
   * API's default language changes, applying it unless user has explicitly chosen a language.
   */
  useEffect(() => {
    if (isLanguagesLoading || languages.length === 0) {
      return;
    }

    const storedLanguage = typeof window !== 'undefined' ? localStorage.getItem('language') : null;
    const userExplicitChoice =
      typeof window !== 'undefined' ? localStorage.getItem('language_user_selected') : null;
    const apiDefaultLanguage = languages.find((lang) => lang.isDefault);

    if (!apiDefaultLanguage) {
      return;
    }

    const apiDefaultCode = apiDefaultLanguage.languageCode;

    // Detect if the API default language has changed
    const apiDefaultChanged =
      lastApiDefaultLanguage.current !== null && lastApiDefaultLanguage.current !== apiDefaultCode;

    // Update the last known API default
    lastApiDefaultLanguage.current = apiDefaultCode;

    // If user has explicitly selected a language, only override if API default changed
    if (userExplicitChoice === 'true' && storedLanguage && !apiDefaultChanged) {
      const storedLanguageExists = languages.some((lang) => lang.languageCode === storedLanguage);
      if (
        storedLanguageExists &&
        storedLanguage !== currentLanguage &&
        hasCheckedDefaultLanguage.current
      ) {
        setLanguage(storedLanguage, false);
        return;
      }
    }

    // Apply the API's default language if:
    // 1. First time checking (initial load)
    // 2. API default has changed
    // 3. No user explicit choice exists
    if (!hasCheckedDefaultLanguage.current || apiDefaultChanged || userExplicitChoice !== 'true') {
      if (apiDefaultCode !== currentLanguage) {
        setLanguage(apiDefaultCode, false);
      }
      hasCheckedDefaultLanguage.current = true;
    }
  }, [languages, isLanguagesLoading, currentLanguage, setLanguage]);

  /**
   * Effect hook to initialize translations when the component mounts.
   * Loads initial translation modules and sets up the language.
   * Waits for languages to be loaded to ensure we use the correct default language.
   */
  useEffect(() => {
    // Don't initialize until languages are loaded and default language check is complete
    if (isInitialized.current || isLanguagesLoading || !hasCheckedDefaultLanguage.current) {
      return;
    }

    const initializeTranslations = async () => {
      setIsLoading(true);
      try {
        await loadLanguageModules(currentLanguage, location.pathname);
        i18n.changeLanguage(currentLanguage);
        isInitialized.current = true;
      } catch (error) {
        console.error('Failed to initialize translations:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeTranslations();
  }, [currentLanguage, location.pathname, loadLanguageModules, i18n, isLanguagesLoading]);

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
  }, [
    currentLanguage,
    location.pathname,
    loadLanguageModules,
    getBaseRoute,
    areModulesCached,
    defaultModules,
  ]);

  const value = useMemo(
    () => ({
      currentLanguage,
      setLanguage,
      isLoading,
      availableLanguages: languages,
      availableModules: modules,
    }),
    [currentLanguage, setLanguage, isLoading, languages, modules]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export const useLanguageContext = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguageContext must be used within a LanguageProvider');
  }
  return context;
};
