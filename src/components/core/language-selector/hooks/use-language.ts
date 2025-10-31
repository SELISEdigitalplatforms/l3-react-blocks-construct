import { useQuery } from '@tanstack/react-query';
import { getLanguage, getModule, getUilmFile } from '../services/language.service';
import { LanguageResponse, ModuleResponse, UilmFileParams } from '../types/language.types';

/**
 * Custom hook to fetch language data from the UILM file
 *
 * This hook uses TanStack Query to fetch and cache language data for a specific
 * language and module. It handles loading, error states, and caching automatically.
 *
 * @param params - Parameters for the language query including language code and module name
 * @returns Query object containing:
 *  - data: The fetched language data when available
 *  - isLoading: Boolean indicating if the request is in progress
 *  - isError: Boolean indicating if the request failed
 *  - error: Error object if the request failed
 *  - refetch: Function to manually trigger a refetch
 *
 * @example
 * const { data, isLoading, error } = useLanguage({
 *   language: 'en-US',
 *   moduleName: 'dashboard'
 * });
 */
export const useGetUilmFile = (params: UilmFileParams) => {
  const { language, moduleName } = params;

  return useQuery({
    queryKey: ['getUilmFile', language, moduleName],
    queryFn: () => getUilmFile(params),
  });
};

/**
 * Custom hook to fetch all available languages from the API
 *
 * This hook uses TanStack Query to fetch and cache the list of all available
 * languages in the system. The response is typed as LanguageResponse (array of Language objects).
 * It handles loading, error states, and caching automatically.
 *
 * @returns Query object containing:
 *  - data: Array of Language objects when available
 *  - isLoading: Boolean indicating if the request is in progress
 *  - isError: Boolean indicating if the request failed
 *  - error: Error object if the request failed
 *  - refetch: Function to manually trigger a refetch
 *
 * @example
 * const { data: languages, isLoading, error } = useAvailableLanguages();
 *
 * // Use the languages data
 * if (isLoading) return <LoadingSpinner />;
 * if (error) return <ErrorMessage error={error} />;
 * return (
 *   <ul>
 *     {languages?.map(lang => (
 *       <li key={lang.itemId}>{lang.languageName}</li>
 *     ))}
 *   </ul>
 * );
 */
export const useAvailableLanguages = () => {
  return useQuery<LanguageResponse>({
    queryKey: ['getLanguages'],
    queryFn: () => getLanguage(),
    staleTime: 0,
    gcTime: 30 * 60 * 1000,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    retry: 2,
    retryDelay: 1000,
  });
};

/**
 * Custom hook to fetch all available modules from the API
 *
 * This hook uses TanStack Query to fetch and cache the list of all available
 * modules in the system. The response is typed as ModuleResponse (array of Module objects).
 * It handles loading, error states, and caching automatically.
 *
 * @returns Query object containing:
 *  - data: Array of Module objects when available
 *  - isLoading: Boolean indicating if the request is in progress
 *  - isError: Boolean indicating if the request failed
 *  - error: Error object if the request failed
 *  - refetch: Function to manually trigger a refetch
 *
 * @example
 * const { data: modules, isLoading, error } = useAvailableModules();
 *
 * // Use the modules data
 * if (isLoading) return <LoadingSpinner />;
 * if (error) return <ErrorMessage error={error} />;
 * return (
 *   <ul>
 *     {modules?.map(module => (
 *       <li key={module.itemId}>{module.moduleName}</li>
 *     ))}
 *   </ul>
 * );
 */
export const useAvailableModules = () => {
  return useQuery<ModuleResponse>({
    queryKey: ['getModule'],
    queryFn: () => getModule(),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
};
