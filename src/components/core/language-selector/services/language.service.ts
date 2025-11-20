import { clients } from '@/lib/https';
import { LanguageResponse, ModuleResponse, UilmFileParams } from '../types/language.types';

/**
 * Fetches UI language module file data from the API
 *
 * This service function retrieves language-specific UI module data for a given language and module name.
 * It constructs the appropriate URL parameters and makes a GET request to the UILM API endpoint.
 *
 * @param {UilmFileParams} params - The parameters for the request
 * @param {string} params.language - The language code to fetch data for (e.g., 'en-US')
 * @param {string} params.moduleName - The name of the module to fetch language data for
 * @returns {Promise<any>} Promise that resolves to the UI language module data
 *
 * @example
 * // Fetch English language data for the dashboard module
 * const dashboardLanguageData = await getUilmFile({
 *   language: 'en-US',
 *   moduleName: 'dashboard'
 * });
 */

const projectKey = import.meta.env.VITE_X_BLOCKS_KEY || '';

export const getUilmFile = async ({ language, moduleName }: UilmFileParams): Promise<any> => {
  const params = new URLSearchParams({
    Language: language,
    ModuleName: moduleName,
    ProjectKey: projectKey,
  });
  const url = `/uilm/v1/Key/GetUilmFile?${params.toString()}`;
  const res = await clients.get<any>(url);

  return res;
};

/**
 * Fetches all available languages from the API
 *
 * This service function retrieves a list of all available languages in the system.
 * It constructs the appropriate URL parameters and makes a GET request to the Language API endpoint.
 * The response is typed as LanguageResponse (array of Language objects).
 *
 * @returns {Promise<LanguageResponse>} Promise that resolves to an array of Language objects
 *
 * @example
 * // Fetch all available languages
 * const languages = await getLanguage();
 *
 * // Find the default language
 * const defaultLanguage = languages.find(lang => lang.isDefault);
 */
export const getLanguage = async (): Promise<LanguageResponse> => {
  const params = new URLSearchParams({
    ProjectKey: projectKey,
  });
  const url = `/uilm/v1/Language/Gets?${params.toString()}`;
  const res = await clients.get<LanguageResponse>(url);

  return res;
};

/**
 * Fetches all available modules from the API
 *
 * This service function retrieves a list of all available modules in the system.
 * It constructs the appropriate URL parameters and makes a GET request to the Module API endpoint.
 * The response is typed as ModuleResponse (array of Module objects).
 *
 * @returns {Promise<ModuleResponse>} Promise that resolves to an array of Module objects
 *
 * @example
 * // Fetch all available modules
 * const modules = await getModule();
 *
 * // Find a specific module by name
 * const dashboardModule = modules.find(module => module.moduleName === 'Dashboard');
 */
export const getModule = async (): Promise<ModuleResponse> => {
  const params = new URLSearchParams({
    ProjectKey: projectKey,
  });
  const url = `/uilm/v1/Module/Gets?${params.toString()}`;
  const res = await clients.get<ModuleResponse>(url);

  return res;
};
