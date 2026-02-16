import { useState, useEffect } from 'react';

/**
 * Custom hook to manage and persist the language preference.
 *
 * This hook manages the current language preference and allows switching the language. It stores the selected language in
 * `localStorage` and sends the language information to the server whenever it changes.
 *
 * @returns {Object} The language state and a function to change the language.
 * @returns {string} language - The current language preference.
 * @returns {Function} changeLanguage - A function to update the language preference.
 *
 * @example
 * const { language, changeLanguage } = useLanguage();
 * changeLanguage('fr'); // Changes the language to French
 */
function useLanguage() {
  const [language, setLanguage] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('language') ?? 'en';
    }
    return 'en';
  });

  useEffect(() => {
    const sendToServer = async () => {
      sendLangInfoToServer(language);
      if (typeof window !== 'undefined') {
        localStorage.setItem('language', language);
      }
    };
    sendToServer();
  }, [language]);

  const changeLanguage = (newLanguage: string) => {
    setLanguage(newLanguage);
  };

  return { language, changeLanguage };
}
export default useLanguage;

/**
 * Sends the language information to the server. This is a placeholder function.
 *
 * @param {string} language - The language preference to be sent to the server.
 *
 * @throws {Error} If called without implementation.
 *
 * @example
 * sendLangInfoToServer('en'); // Sends the language information (e.g., English) to the server.
 */

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function sendLangInfoToServer(language: string) {
  throw new Error('Function not implemented.');
}
