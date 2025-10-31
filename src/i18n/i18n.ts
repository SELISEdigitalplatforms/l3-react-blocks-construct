/**
 * @fileoverview i18n configuration and utility functions for internationalization.
 * This module sets up i18next with React integration and provides utilities for
 * dynamic translation loading.
 *
 * @module i18n
 */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getUilmFile } from '@/components/core/language-selector/services/language.service';

// declare custom type options so the return is always a string.
declare module 'i18next' {
  interface CustomTypeOptions {
    returnNull: false;
  }
}

/**
 * Initialize i18next instance with default configuration.
 * - Sets English (US) as the default and fallback language
 * - Disables HTML escaping for interpolation
 * - Ensures null is never returned (always returns string)
 * - Starts with empty resources (loaded dynamically)
 */
i18n.use(initReactI18next).init({
  lng: 'en-US',
  fallbackLng: 'en-US',
  interpolation: {
    escapeValue: false,
  },
  returnNull: false,
  resources: {},
});

/**
 * Loads and registers translations for a specific language and module.
 *
 * This function fetches translations from the API and adds them to the i18n instance.
 * It handles the translations in two ways:
 * 1. Adds them to the default 'translation' namespace for direct access
 * 2. Adds them to a module-specific namespace for organized access
 *
 * The function includes error handling and will not throw errors to avoid breaking the UI.
 *
 * @param {string} language - The language code to load translations for (e.g., 'en-US', 'fr-FR')
 * @param {string} moduleName - The module name to load translations for (e.g., 'common', 'dashboard')
 * @returns {Promise<void>} Resolves when translations are loaded and registered
 * @throws {never} Catches all errors internally to prevent UI disruption
 *
 * @example
 * // Load translations for the dashboard module in French
 * await loadTranslations('fr-FR', 'dashboard');
 */
export const loadTranslations = async (language: string, moduleName: string): Promise<void> => {
  try {
    const translations = await getUilmFile({ language, moduleName });

    if (!translations) {
      return;
    }

    // Add the translations directly to i18n resources in the default namespace
    // This allows direct access to keys without namespace prefix
    i18n.addResourceBundle(
      language,
      'translation', // Default namespace for direct key access
      translations, // The JSON object with keys and translations
      true, // Deep merge
      true // Overwrite
    );

    // Also add to the specific module namespace for organization
    // This allows accessing keys with namespace prefix if needed
    i18n.addResourceBundle(language, moduleName, translations, true, true);

    // Translation loaded successfully
  } catch (error) {
    console.error(`Failed to load translations for module ${moduleName}:`, error);
  }
};

/**
 * ---------------------------------------------------------------------------
 * Key Mode Toggle Logic
 * ---------------------------------------------------------------------------
 * The following code enables dynamic toggling between displaying translation
 * **values** (default) and **keys** (key-mode) at runtime. The toggle is driven
 * by messages sent from a browser extension via `window.postMessage`.
 *
 * Expected message format:
 *   { action: 'keymode', keymode: boolean, defaultLang?: string }
 *
 * When `keymode` is `true`, all calls to `i18n.t()` will return the **key**
 * instead of the translated value. This is achieved by monkey-patching the
 * `i18n.t` function while preserving its original behaviour for normal mode.
 *
 * Renders are refreshed by emitting a `languageChanged` event, which the
 * `react-i18next` provider already listens to for triggering re-renders.
 * ---------------------------------------------------------------------------
 */

declare global {
  interface Window {
    __i18nKeyMode?: boolean;
  }
}

// Initialise global flag
if (typeof window !== 'undefined') {
  window.__i18nKeyMode = false;
}

// Preserve original translator
const originalT = i18n.t.bind(i18n);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(i18n as any).t = (key: string | string[], options?: Record<string, unknown>) => {
  if (typeof window !== 'undefined' && window.__i18nKeyMode) {
    if (Array.isArray(key)) return key[0];
    return key;
  }
  return (originalT as any)(key, options);
};

// Listen for messages coming from the browser extension
if (typeof window !== 'undefined') {
  window.addEventListener('message', (event) => {
    if (event.source !== window) return; // Ignore messages from iframes or other sources
    if (event.origin !== window.location.origin) return; // Prevent cross-origin injections
    const { data } = event;
    if (!data || typeof data !== 'object') return;

    const { action, keymode } = data as { action?: string; keymode?: boolean };
    if (action === 'keymode' && typeof keymode === 'boolean') {
      const previous = window.__i18nKeyMode;
      window.__i18nKeyMode = keymode;

      if (previous !== keymode) {
        (i18n as any).emit('languageChanged', i18n.language);
      }
    }
  });
}

export default i18n;
