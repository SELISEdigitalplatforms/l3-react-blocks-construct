/**
 * Language interface representing the structure of language data from the API
 */
export interface Language {
  itemId: string;
  languageName: string;
  languageCode: string;
  isDefault: boolean;
  projectKey: string;
}

/**
 * Response type for the getLanguage API call
 */
export type LanguageResponse = Language[];

/**
 * Parameters for the getUilmFile API call
 */
export interface UilmFileParams {
  language: string;
  moduleName: string;
}

/**
 * Module interface representing the structure of module data from the API
 */
export interface Module {
  itemId: string;
  createDate: string;
  lastUpdateDate: string;
  createdBy: string;
  lastUpdatedBy: string;
  tenantId: string;
  moduleName: string;
}

/**
 * Response type for the getModule API call
 */
export type ModuleResponse = Module[];
