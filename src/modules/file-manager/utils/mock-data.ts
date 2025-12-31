import { FileType, FilterOption } from '../types/file-manager.type';
import { IFileDataWithSharing, IFileTrashData, SharedUser } from './file-manager';

interface BaseFileDefinition {
  id: string;
  name: string;
  fileType: FileType;
  lastModified: string;
  size: string;
  isShared: boolean;
  sharedById: string;
  sharedWithIds?: string[];
}

interface FileOptions {
  lastModified?: string;
  size?: string;
  isShared?: boolean;
  sharedById?: string;
  sharedWithIds?: string[];
}

interface TrashItemInput {
  idSuffix: string;
  name: string;
  fileType: FileType;
  trashedDate: string;
  size?: string;
  isShared?: boolean;
}

interface FolderItemInput {
  idSuffix: string;
  name: string;
  fileType: FileType;
  lastModified?: string;
  size?: string;
  isShared?: boolean;
  sharedById?: string;
  sharedWithIds?: string[];
}

const USER_POOL: Record<string, SharedUser> = {
  '1': { id: '1', name: 'Luca Meier', avatar: '/avatars/luca-meier.jpg' },
  '2': { id: '2', name: 'Aaron Green', avatar: '/avatars/aaron-green.jpg' },
  '3': { id: '3', name: 'Sarah Pavan', avatar: '/avatars/sarah-pavan.jpg' },
  '4': { id: '4', name: 'Adrian Müller', avatar: '/avatars/adrian-muller.jpg' },
};

// ============================================================================
// UTILITY FUNCTIONS FOR MOCK DATA CREATION
// ============================================================================

const getUser = (id: string): SharedUser => USER_POOL[id];
const getUsers = (ids: string[]): SharedUser[] => ids.map((id) => USER_POOL[id]);

const DEFAULT_OPTIONS: Required<FileOptions> = {
  lastModified: '2025-02-01',
  size: '1.0 MB',
  isShared: false,
  sharedById: '1',
  sharedWithIds: [],
};

/**
 * Unified function to create file definitions with default values
 */
const createFileDefinition = (
  id: string,
  name: string,
  fileType: FileType,
  options: FileOptions = {}
): BaseFileDefinition => ({
  id,
  name,
  fileType,
  lastModified: options.lastModified ?? DEFAULT_OPTIONS.lastModified,
  size: options.size ?? DEFAULT_OPTIONS.size,
  isShared: options.isShared ?? DEFAULT_OPTIONS.isShared,
  sharedById: options.sharedById ?? DEFAULT_OPTIONS.sharedById,
  sharedWithIds: options.sharedWithIds,
});

/**
 * Generic function to convert definition to IFileDataWithSharing
 */
const definitionToFile = (
  def: BaseFileDefinition,
  parentFolderId?: string
): IFileDataWithSharing => ({
  id: def.id,
  name: def.name,
  lastModified: new Date(def.lastModified),
  fileType: def.fileType,
  size: def.size,
  isShared: def.isShared,
  sharedBy: getUser(def.sharedById),
  sharedDate: new Date(def.lastModified),
  sharedWith: def.isShared && def.sharedWithIds ? getUsers(def.sharedWithIds) : undefined,
  parentFolderId,
});

/**
 * Generic function to create items with folder prefix
 */
const createItemsWithPrefix = <T extends FolderItemInput | TrashItemInput>(
  folderId: string,
  items: T[],
  mapFn: (item: T, fullId: string) => BaseFileDefinition
): BaseFileDefinition[] =>
  items.map((item) => {
    const fullId = `${folderId}-${item.idSuffix}`;
    return mapFn(item, fullId);
  });

/**
 * Create folder contents from item definitions
 */
const createFolderContents = (folderId: string, files: FolderItemInput[]): BaseFileDefinition[] =>
  createItemsWithPrefix(folderId, files, (file, fullId) =>
    createFileDefinition(fullId, file.name, file.fileType, {
      lastModified: file.lastModified,
      size: file.size,
      isShared: file.isShared,
      sharedById: file.sharedById ?? DEFAULT_OPTIONS.sharedById,
      sharedWithIds: file.sharedWithIds,
    })
  );

/**
 * Create trash folder contents from item definitions
 */
const createTrashFolderContents = (
  folderId: string,
  items: TrashItemInput[]
): BaseFileDefinition[] =>
  createItemsWithPrefix(folderId, items, (item, fullId) =>
    createFileDefinition(fullId, item.name, item.fileType, {
      lastModified: item.trashedDate,
      size: item.size ?? '21.4 MB',
      isShared: item.isShared ?? true,
    })
  );

/**
 * Convert definition to trash data
 */
const definitionToTrash = (def: BaseFileDefinition, parentFolderId?: string): IFileTrashData => ({
  id: def.id,
  name: def.name,
  fileType: def.fileType,
  size: def.size,
  trashedDate: new Date(def.lastModified),
  isShared: def.isShared,
  parentFolderId,
});

/**
 * Generic function to convert definitions to target type
 */
const convertDefinitions = <T>(
  definitions: BaseFileDefinition[],
  converter: (def: BaseFileDefinition, parentId?: string) => T,
  parentId?: string
): T[] => definitions.map((def) => converter(def, parentId));

/**
 * Helper to create a file item with common defaults
 */
const createFileItem = (
  idSuffix: string,
  name: string,
  fileType: FileType,
  overrides: Partial<FolderItemInput> = {}
): FolderItemInput => ({
  idSuffix,
  name,
  fileType,
  ...overrides,
});

/**
 * Helper to create a trash item with common defaults
 */
const createTrashItem = (
  idSuffix: string,
  name: string,
  fileType: FileType,
  trashedDate: string,
  overrides: Partial<TrashItemInput> = {}
): TrashItemInput => ({
  idSuffix,
  name,
  fileType,
  trashedDate,
  ...overrides,
});

/**
 * Helper to reduce Record<string, T[]> with converter
 */
const convertRecordDefinitions = <T>(
  data: Record<string, BaseFileDefinition[]>,
  converter: (def: BaseFileDefinition, parentId?: string) => T
): Record<string, T[]> =>
  Object.entries(data).reduce(
    (acc, [folderId, definitions]) => {
      acc[folderId] = convertDefinitions(definitions, converter, folderId);
      return acc;
    },
    {} as Record<string, T[]>
  );

// ============================================================================
// DATA DEFINITIONS
// ============================================================================

const FOLDER_CONTENTS_DATA: Record<string, BaseFileDefinition[]> = {
  '1': createFolderContents('1', [
    createFileItem('1', 'Weekly_Standup_Notes.doc', 'File', {
      size: '2.3 MB',
      isShared: true,
      sharedById: '1',
      sharedWithIds: ['2', '3'],
    }),
    createFileItem('2', 'Sprint_Planning.pdf', 'File', {
      lastModified: '2025-01-28',
      size: '1.8 MB',
      isShared: true,
      sharedById: '2',
      sharedWithIds: ['2'],
    }),
    createFileItem('3', 'Action_Items.xlsx', 'File', {
      lastModified: '2025-01-25',
      size: '0.9 MB',
      isShared: false,
      sharedById: '3',
    }),
  ]),
  '2': createFolderContents('2', [
    createFileItem('1', 'Survey_Results.csv', 'File', {
      lastModified: '2025-02-02',
      size: '5.4 MB',
      isShared: true,
      sharedById: '2',
      sharedWithIds: ['1', '4'],
    }),
    createFileItem('2', 'Analysis_Report.pdf', 'File', {
      lastModified: '2025-01-30',
      size: '3.2 MB',
      isShared: true,
      sharedWithIds: ['2', '3', '4'],
    }),
    createFileItem('3', 'Raw_Data.json', 'File', {
      lastModified: '2025-01-27',
      size: '12.1 MB',
      isShared: false,
      sharedById: '4',
    }),
  ]),
  '3': createFolderContents('3', [
    createFileItem('1', 'Contract_Agreement.pdf', 'File', {
      size: '2.7 MB',
      isShared: true,
      sharedById: '3',
      sharedWithIds: ['1', '2'],
    }),
    createFileItem('2', 'Client_Proposal.docx', 'File', {
      lastModified: '2025-01-29',
      size: '4.1 MB',
      isShared: true,
      sharedWithIds: ['3', '4'],
    }),
    createFileItem('3', 'Requirements_Spec.pdf', 'File', {
      lastModified: '2025-01-26',
      size: '6.3 MB',
      isShared: true,
      sharedById: '2',
      sharedWithIds: ['1', '3'],
    }),
  ]),
  '4': createFolderContents('4', [
    createFileItem('1', 'Architecture_Diagram.png', 'Image', {
      size: '3.8 MB',
      isShared: true,
      sharedWithIds: ['2', '4'],
    }),
    createFileItem('2', 'Technical_Specs.md', 'File', {
      lastModified: '2025-01-31',
      size: '1.2 MB',
      isShared: true,
      sharedById: '4',
      sharedWithIds: ['1', '2', '3'],
    }),
    createFileItem('3', 'Code_Review.pdf', 'File', {
      lastModified: '2025-01-28',
      size: '2.9 MB',
      isShared: false,
      sharedById: '3',
    }),
  ]),
  '5': createFolderContents('5', [
    createFileItem('1', 'Logo_Variations.ai', 'File', {
      lastModified: '2025-02-02',
      size: '8.4 MB',
      isShared: true,
      sharedById: '4',
      sharedWithIds: ['1', '3'],
    }),
    createFileItem('2', 'UI_Components.sketch', 'File', {
      lastModified: '2025-01-30',
      size: '15.7 MB',
      isShared: true,
      sharedById: '3',
      sharedWithIds: ['1', '2', '4'],
    }),
    createFileItem('3', 'Color_Palette.png', 'Image', {
      lastModified: '2025-01-27',
      size: '1.1 MB',
      isShared: true,
      sharedWithIds: ['2', '3'],
    }),
  ]),
  '11': createFolderContents('11', [
    createFileItem('1', 'Campaign_Banner.jpg', 'Image', {
      lastModified: '2025-01-31',
      size: '7.2 MB',
      isShared: true,
      sharedById: '4',
      sharedWithIds: ['1', '2'],
    }),
    createFileItem('2', 'Social_Media_Kit.zip', 'File', {
      lastModified: '2025-01-29',
      size: '23.5 MB',
      isShared: true,
      sharedById: '2',
      sharedWithIds: ['1', '3', '4'],
    }),
    createFileItem('3', 'Brand_Guidelines.pdf', 'File', {
      lastModified: '2025-01-26',
      size: '9.8 MB',
      isShared: true,
      sharedById: '3',
      sharedWithIds: ['1', '2', '4'],
    }),
  ]),
};

const ROOT_FILES_DEFINITIONS: BaseFileDefinition[] = [
  {
    id: '1',
    name: 'Meeting Notes',
    fileType: 'Folder',
    size: '21.4 MB',
    isShared: false,
    sharedById: '1',
    lastModified: '2025-02-01',
  },
  {
    id: '2',
    name: 'Research Data',
    fileType: 'Folder',
    size: '21.4 MB',
    isShared: false,
    sharedById: '2',
    lastModified: '2025-02-01',
  },
  {
    id: '3',
    name: 'Client Documents',
    fileType: 'Folder',
    size: '21.4 MB',
    isShared: true,
    sharedById: '3',
    sharedWithIds: ['1', '2', '4'],
    lastModified: '2025-02-01',
  },
  {
    id: '4',
    name: 'Project Files',
    fileType: 'Folder',
    size: '21.4 MB',
    isShared: true,
    sharedById: '1',
    sharedWithIds: ['2', '3'],
    lastModified: '2025-02-01',
  },
  {
    id: '5',
    name: 'Design Assets',
    fileType: 'Folder',
    size: '21.4 MB',
    isShared: true,
    sharedById: '4',
    sharedWithIds: ['1', '2', '3'],
    lastModified: '2025-02-01',
  },
  {
    id: '6',
    name: 'Project Documents.doc',
    fileType: 'File',
    size: '21.4 MB',
    isShared: true,
    sharedById: '3',
    sharedWithIds: ['1', '4'],
    lastModified: '2025-02-01',
  },
  {
    id: '7',
    name: 'Image.jpg',
    fileType: 'Image',
    size: '21.4 MB',
    isShared: false,
    sharedById: '4',
    lastModified: '2025-02-01',
  },
  {
    id: '8',
    name: 'Chill Beats Mix.mp3',
    fileType: 'Audio',
    size: '21.4 MB',
    isShared: true,
    sharedById: '2',
    sharedWithIds: ['1', '3'],
    lastModified: '2025-02-01',
  },
  {
    id: '9',
    name: 'Adventure_Video.mp4',
    fileType: 'Video',
    size: '21.4 MB',
    isShared: true,
    sharedById: '1',
    sharedWithIds: ['2', '3', '4'],
    lastModified: '2025-02-01',
  },
  {
    id: '10',
    name: 'Requirements.doc',
    fileType: 'File',
    size: '21.4 MB',
    isShared: true,
    sharedById: '3',
    sharedWithIds: ['1', '2'],
    lastModified: '2025-02-01',
  },
  {
    id: '11',
    name: 'Marketing Assets',
    fileType: 'Folder',
    lastModified: '2025-02-01',
    size: '45.2 MB',
    isShared: true,
    sharedById: '4',
    sharedWithIds: ['1', '2', '3'],
  },
  {
    id: '12',
    name: 'Budget Spreadsheet.xlsx',
    fileType: 'File',
    lastModified: '2025-01-28',
    size: '2.1 MB',
    isShared: true,
    sharedById: '2',
    sharedWithIds: ['1', '3', '4'],
  },
  {
    id: '13',
    name: 'Team Photo.png',
    fileType: 'Image',
    lastModified: '2025-01-25',
    size: '8.7 MB',
    isShared: true,
    sharedById: '1',
    sharedWithIds: ['2', '4'],
  },
  {
    id: '14',
    name: 'Presentation.pptx',
    fileType: 'File',
    lastModified: '2025-01-20',
    size: '15.3 MB',
    isShared: true,
    sharedById: '3',
    sharedWithIds: ['1', '2', '4'],
  },
  {
    id: '15',
    name: 'Training Video.mp4',
    fileType: 'Video',
    lastModified: '2025-01-15',
    size: '125.8 MB',
    isShared: true,
    sharedById: '4',
    sharedWithIds: ['1', '2', '3'],
  },
];

const TRASH_DEFINITIONS: BaseFileDefinition[] = [
  createFileDefinition('1', 'Adventure_Video.mp4', 'Video', {
    lastModified: '2025-01-03',
    size: '21.4 MB',
    isShared: false,
  }),
  createFileDefinition('2', 'Cat.jpg', 'Image', {
    lastModified: '2025-02-03',
    size: '21.4 MB',
    isShared: false,
  }),
  createFileDefinition('3', 'Design Assets', 'Folder', {
    lastModified: '2025-03-03',
    size: '21.4 MB',
    isShared: true,
  }),
  createFileDefinition('4', 'Design Assets 2', 'Folder', {
    lastModified: '2025-04-03',
    size: '21.4 MB',
    isShared: true,
  }),
  createFileDefinition('5', 'Ftoof.jpg', 'Image', {
    lastModified: '2025-05-03',
    size: '21.4 MB',
    isShared: false,
  }),
  createFileDefinition('6', 'Project Documents.doc', 'File', {
    lastModified: '2025-05-05',
    size: '21.4 MB',
    isShared: false,
  }),
];

const TRASH_FOLDER_CONTENTS: Record<string, BaseFileDefinition[]> = {
  '3': createTrashFolderContents('3', [
    createTrashItem('1', 'Logo_Design.png', 'Image', '2025-01-03', { size: '2.1 MB' }),
    createTrashItem('2', 'Brand_Guidelines.pdf', 'File', '2025-06-03', { size: '5.3 MB' }),
    createTrashItem('3', 'Icon_Set.svg', 'Image', '2025-03-03', { size: '1.8 MB' }),
  ]),
  '4': createTrashFolderContents('4', [
    createTrashItem('1', 'Mockup_Design.jpg', 'Image', '2025-01-10', { size: '4.2 MB' }),
    createTrashItem('2', 'Style_Guide.docx', 'File', '2025-04-03', { size: '3.1 MB' }),
    createTrashItem('3', 'Color_Palette.png', 'Image', '2025-04-03', { size: '0.9 MB' }),
  ]),
};

// ============================================================================
// GENERATED EXPORTS
// ============================================================================

export const filesFolderContents: Record<string, IFileDataWithSharing[]> = convertRecordDefinitions(
  FOLDER_CONTENTS_DATA,
  definitionToFile
);

export const mockFileData: IFileDataWithSharing[] = convertDefinitions(
  ROOT_FILES_DEFINITIONS,
  definitionToFile
);

export const trashMockData: IFileTrashData[] = convertDefinitions(
  TRASH_DEFINITIONS,
  definitionToTrash
);

export const folderContents: Record<string, IFileTrashData[]> = convertRecordDefinitions(
  TRASH_FOLDER_CONTENTS,
  definitionToTrash
);

// ============================================================================
// PUBLIC API
// ============================================================================

export const getAllUsers = (): SharedUser[] => Object.values(USER_POOL);

export const getUserById = (id: string): SharedUser | undefined => USER_POOL[id];

export const getUsersByIds = (ids: string[]): SharedUser[] =>
  ids.map((id) => USER_POOL[id]).filter(Boolean);

export const createMockFile = (
  id: string,
  name: string,
  fileType: FileType,
  options: FileOptions & { parentFolderId?: string } = {}
): IFileDataWithSharing => {
  const { parentFolderId, ...fileOptions } = options;
  const definition = createFileDefinition(id, name, fileType, {
    ...fileOptions,
    lastModified: fileOptions.lastModified ?? new Date().toISOString().split('T')[0],
  });
  return definitionToFile(definition, parentFolderId);
};

export const addFolderContent = (folderId: string, items: FolderItemInput[]): void => {
  const definitions = createFolderContents(folderId, items);
  FOLDER_CONTENTS_DATA[folderId] = definitions;
  filesFolderContents[folderId] = convertDefinitions(definitions, definitionToFile, folderId);
};

export const getFileTypeFilters = (t: (key: string) => string): FilterOption[] => [
  { value: 'Folder', label: t('FOLDER') },
  { value: 'File', label: t('FILE') },
  { value: 'Image', label: t('IMAGE') },
  { value: 'Audio', label: t('AUDIO') },
  { value: 'Video', label: t('VIDEO') },
];
