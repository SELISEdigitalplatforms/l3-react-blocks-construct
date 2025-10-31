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

type FolderContentDefinition = BaseFileDefinition;
type RootFileDefinition = BaseFileDefinition;

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

const createFile = (
  id: string,
  name: string,
  fileType: FileType,
  lastModified: string,
  size: string,
  isShared: boolean,
  sharedById: string,
  sharedWithIds: string[] = [],
  parentFolderId?: string
): IFileDataWithSharing => ({
  id,
  name,
  lastModified: new Date(lastModified),
  fileType,
  size,
  isShared,
  sharedBy: getUser(sharedById),
  sharedDate: new Date(lastModified),
  sharedWith: isShared ? getUsers(sharedWithIds) : undefined,
  parentFolderId,
});

const createFileDefinition = (
  id: string,
  name: string,
  fileType: FileType,
  options: Partial<BaseFileDefinition> = {}
): BaseFileDefinition => ({
  id,
  name,
  fileType,
  lastModified: options.lastModified ?? '2025-02-01',
  size: options.size ?? '1.0 MB',
  isShared: options.isShared ?? false,
  sharedById: options.sharedById ?? '1',
  sharedWithIds: options.sharedWithIds,
});

const createFolderContents = (
  folderId: string,
  files: Array<{
    idSuffix: string;
    name: string;
    fileType: FileType;
    lastModified?: string;
    size?: string;
    isShared?: boolean;
    sharedById?: string;
    sharedWithIds?: string[];
  }>
): FolderContentDefinition[] =>
  files.map((file) =>
    createFileDefinition(`${folderId}-${file.idSuffix}`, file.name, file.fileType, {
      lastModified: file.lastModified,
      size: file.size,
      isShared: file.isShared,
      sharedById: file.sharedById ?? '1',
      sharedWithIds: file.sharedWithIds,
    })
  );

const FOLDER_CONTENTS_DATA: Record<string, FolderContentDefinition[]> = {
  '1': createFolderContents('1', [
    {
      idSuffix: '1',
      name: 'Weekly_Standup_Notes.doc',
      fileType: 'File',
      size: '2.3 MB',
      isShared: true,
      sharedById: '1',
      sharedWithIds: ['2', '3'],
    },
    {
      idSuffix: '2',
      name: 'Sprint_Planning.pdf',
      fileType: 'File',
      lastModified: '2025-01-28',
      size: '1.8 MB',
      isShared: true,
      sharedById: '2',
      sharedWithIds: ['2'],
    },
    {
      idSuffix: '3',
      name: 'Action_Items.xlsx',
      fileType: 'File',
      lastModified: '2025-01-25',
      size: '0.9 MB',
      isShared: false,
      sharedById: '3',
    },
  ]),
  '2': createFolderContents('2', [
    {
      idSuffix: '1',
      name: 'Survey_Results.csv',
      fileType: 'File',
      lastModified: '2025-02-02',
      size: '5.4 MB',
      isShared: true,
      sharedById: '2',
      sharedWithIds: ['1', '4'],
    },
    {
      idSuffix: '2',
      name: 'Analysis_Report.pdf',
      fileType: 'File',
      lastModified: '2025-01-30',
      size: '3.2 MB',
      isShared: true,
      sharedWithIds: ['2', '3', '4'],
    },
    {
      idSuffix: '3',
      name: 'Raw_Data.json',
      fileType: 'File',
      lastModified: '2025-01-27',
      size: '12.1 MB',
      isShared: false,
      sharedById: '4',
    },
  ]),
  '3': createFolderContents('3', [
    {
      idSuffix: '1',
      name: 'Contract_Agreement.pdf',
      fileType: 'File',
      size: '2.7 MB',
      isShared: true,
      sharedById: '3',
      sharedWithIds: ['1', '2'],
    },
    {
      idSuffix: '2',
      name: 'Client_Proposal.docx',
      fileType: 'File',
      lastModified: '2025-01-29',
      size: '4.1 MB',
      isShared: true,
      sharedWithIds: ['3', '4'],
    },
    {
      idSuffix: '3',
      name: 'Requirements_Spec.pdf',
      fileType: 'File',
      lastModified: '2025-01-26',
      size: '6.3 MB',
      isShared: true,
      sharedById: '2',
      sharedWithIds: ['1', '3'],
    },
  ]),
  '4': createFolderContents('4', [
    {
      idSuffix: '1',
      name: 'Architecture_Diagram.png',
      fileType: 'Image',
      size: '3.8 MB',
      isShared: true,
      sharedWithIds: ['2', '4'],
    },
    {
      idSuffix: '2',
      name: 'Technical_Specs.md',
      fileType: 'File',
      lastModified: '2025-01-31',
      size: '1.2 MB',
      isShared: true,
      sharedById: '4',
      sharedWithIds: ['1', '2', '3'],
    },
    {
      idSuffix: '3',
      name: 'Code_Review.pdf',
      fileType: 'File',
      lastModified: '2025-01-28',
      size: '2.9 MB',
      isShared: false,
      sharedById: '3',
    },
  ]),
  '5': createFolderContents('5', [
    {
      idSuffix: '1',
      name: 'Logo_Variations.ai',
      fileType: 'File',
      lastModified: '2025-02-02',
      size: '8.4 MB',
      isShared: true,
      sharedById: '4',
      sharedWithIds: ['1', '3'],
    },
    {
      idSuffix: '2',
      name: 'UI_Components.sketch',
      fileType: 'File',
      lastModified: '2025-01-30',
      size: '15.7 MB',
      isShared: true,
      sharedById: '3',
      sharedWithIds: ['1', '2', '4'],
    },
    {
      idSuffix: '3',
      name: 'Color_Palette.png',
      fileType: 'Image',
      lastModified: '2025-01-27',
      size: '1.1 MB',
      isShared: true,
      sharedWithIds: ['2', '3'],
    },
  ]),
  '11': createFolderContents('11', [
    {
      idSuffix: '1',
      name: 'Campaign_Banner.jpg',
      fileType: 'Image',
      lastModified: '2025-01-31',
      size: '7.2 MB',
      isShared: true,
      sharedById: '4',
      sharedWithIds: ['1', '2'],
    },
    {
      idSuffix: '2',
      name: 'Social_Media_Kit.zip',
      fileType: 'File',
      lastModified: '2025-01-29',
      size: '23.5 MB',
      isShared: true,
      sharedById: '2',
      sharedWithIds: ['1', '3', '4'],
    },
    {
      idSuffix: '3',
      name: 'Brand_Guidelines.pdf',
      fileType: 'File',
      lastModified: '2025-01-26',
      size: '9.8 MB',
      isShared: true,
      sharedById: '3',
      sharedWithIds: ['1', '2', '4'],
    },
  ]),
};

const createRootFiles = (
  files: Array<{
    id: string;
    name: string;
    fileType: FileType;
    lastModified?: string;
    size?: string;
    isShared?: boolean;
    sharedById?: string;
    sharedWithIds?: string[];
  }>
): RootFileDefinition[] =>
  files.map((file) =>
    createFileDefinition(file.id, file.name, file.fileType, {
      lastModified: file.lastModified,
      size: file.size,
      isShared: file.isShared,
      sharedById: file.sharedById ?? '1',
      sharedWithIds: file.sharedWithIds,
    })
  );

const ROOT_FILES_DATA: RootFileDefinition[] = createRootFiles([
  {
    id: '1',
    name: 'Meeting Notes',
    fileType: 'Folder',
    size: '21.4 MB',
    isShared: false,
  },
  {
    id: '2',
    name: 'Research Data',
    fileType: 'Folder',
    size: '21.4 MB',
    isShared: false,
    sharedById: '2',
  },
  {
    id: '3',
    name: 'Client Documents',
    fileType: 'Folder',
    size: '21.4 MB',
    isShared: true,
    sharedById: '3',
    sharedWithIds: ['1', '2', '4'],
  },
  {
    id: '4',
    name: 'Project Files',
    fileType: 'Folder',
    size: '21.4 MB',
    isShared: true,
    sharedWithIds: ['2', '3'],
  },
  {
    id: '5',
    name: 'Design Assets',
    fileType: 'Folder',
    size: '21.4 MB',
    isShared: true,
    sharedById: '4',
    sharedWithIds: ['1', '2', '3'],
  },
  {
    id: '6',
    name: 'Project Documents.doc',
    fileType: 'File',
    size: '21.4 MB',
    isShared: true,
    sharedById: '3',
    sharedWithIds: ['1', '4'],
  },
  {
    id: '7',
    name: 'Image.jpg',
    fileType: 'Image',
    size: '21.4 MB',
    isShared: false,
    sharedById: '4',
  },
  {
    id: '8',
    name: 'Chill Beats Mix.mp3',
    fileType: 'Audio',
    size: '21.4 MB',
    isShared: true,
    sharedById: '2',
    sharedWithIds: ['1', '3'],
  },
  {
    id: '9',
    name: 'Adventure_Video.mp4',
    fileType: 'Video',
    size: '21.4 MB',
    isShared: true,
    sharedWithIds: ['2', '3', '4'],
  },
  {
    id: '10',
    name: 'Requirements.doc',
    fileType: 'File',
    size: '21.4 MB',
    isShared: true,
    sharedById: '3',
    sharedWithIds: ['1', '2'],
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
]);

// ============================================================================
// GENERATED EXPORTS
// ============================================================================

export const filesFolderContents: Record<string, IFileDataWithSharing[]> = Object.entries(
  FOLDER_CONTENTS_DATA
).reduce(
  (acc, [folderId, files]) => {
    acc[folderId] = files.map((file) =>
      createFile(
        file.id,
        file.name,
        file.fileType,
        file.lastModified,
        file.size,
        file.isShared,
        file.sharedById,
        file.sharedWithIds,
        folderId
      )
    );
    return acc;
  },
  {} as Record<string, IFileDataWithSharing[]>
);

export const mockFileData: IFileDataWithSharing[] = ROOT_FILES_DATA.map((file) =>
  createFile(
    file.id,
    file.name,
    file.fileType,
    file.lastModified,
    file.size,
    file.isShared,
    file.sharedById,
    file.sharedWithIds
  )
);

/**
 * Get all users from the user pool
 */
export const getAllUsers = (): SharedUser[] => Object.values(USER_POOL);

/**
 * Get a specific user by ID
 */
export const getUserById = (id: string): SharedUser | undefined => USER_POOL[id];

/**
 * Get multiple users by their IDs
 */
export const getUsersByIds = (ids: string[]): SharedUser[] =>
  ids.map((id) => USER_POOL[id]).filter(Boolean);

/**
 * Create a new file with the same structure as existing ones
 */
export const createMockFile = (
  id: string,
  name: string,
  fileType: FileType,
  options: {
    lastModified?: string;
    size?: string;
    isShared?: boolean;
    sharedById?: string;
    sharedWithIds?: string[];
    parentFolderId?: string;
  } = {}
): IFileDataWithSharing => {
  const {
    lastModified = new Date().toISOString().split('T')[0],
    size = '1.0 MB',
    isShared = false,
    sharedById = '1',
    sharedWithIds = [],
    parentFolderId,
  } = options;

  return createFile(
    id,
    name,
    fileType,
    lastModified,
    size,
    isShared,
    sharedById,
    sharedWithIds,
    parentFolderId
  );
};

// ============================================================================
// TRASH HELPERS
// ============================================================================

const createTrashFile = (
  id: string,
  name: string,
  fileType: FileType,
  trashedDate: string,
  size = '21.4 MB',
  isShared = false,
  parentFolderId?: string
): IFileTrashData => ({
  id,
  name,
  fileType,
  size,
  trashedDate: new Date(trashedDate),
  isShared,
  parentFolderId,
});

const createTrashFolderContents = (
  folderId: string,
  items: Array<{
    idSuffix: string;
    name: string;
    fileType: FileType;
    trashedDate: string;
    size?: string;
    isShared?: boolean;
  }>
): IFileTrashData[] =>
  items.map((it) =>
    createTrashFile(
      `${folderId}-${it.idSuffix}`,
      it.name,
      it.fileType,
      it.trashedDate,
      it.size ?? '21.4 MB',
      it.isShared ?? true,
      folderId
    )
  );

/**
 * Add a new folder to the folder contents
 */
export const addFolderContent = (folderId: string, files: FolderContentDefinition[]): void => {
  FOLDER_CONTENTS_DATA[folderId] = files;
  filesFolderContents[folderId] = files.map((file) =>
    createFile(
      file.id,
      file.name,
      file.fileType,
      file.lastModified,
      file.size,
      file.isShared,
      file.sharedById,
      file.sharedWithIds,
      folderId
    )
  );
};

export type { FolderContentDefinition, RootFileDefinition };

export const trashMockData: IFileTrashData[] = [
  createTrashFile('1', 'Adventure_Video.mp4', 'Video', '2025-01-03', '21.4 MB', false),
  createTrashFile('2', 'Cat.jpg', 'Image', '2025-02-03', '21.4 MB', false),
  createTrashFile('3', 'Design Assets', 'Folder', '2025-03-03', '21.4 MB', true),
  createTrashFile('4', 'Design Assets 2', 'Folder', '2025-04-03', '21.4 MB', true),
  createTrashFile('5', 'Ftoof.jpg', 'Image', '2025-05-03', '21.4 MB', false),
  createTrashFile('6', 'Project Documents.doc', 'File', '2025-05-05', '21.4 MB', false),
];

export const folderContents: Record<string, IFileTrashData[]> = {
  '3': createTrashFolderContents('3', [
    {
      idSuffix: '1',
      name: 'Logo_Design.png',
      fileType: 'Image',
      trashedDate: '2025-01-03',
      size: '2.1 MB',
    },
    {
      idSuffix: '2',
      name: 'Brand_Guidelines.pdf',
      fileType: 'File',
      trashedDate: '2025-06-03',
      size: '5.3 MB',
    },
    {
      idSuffix: '3',
      name: 'Icon_Set.svg',
      fileType: 'Image',
      trashedDate: '2025-03-03',
      size: '1.8 MB',
    },
  ]),
  '4': createTrashFolderContents('4', [
    {
      idSuffix: '1',
      name: 'Mockup_Design.jpg',
      fileType: 'Image',
      trashedDate: '2025-01-10',
      size: '4.2 MB',
    },
    {
      idSuffix: '2',
      name: 'Style_Guide.docx',
      fileType: 'File',
      trashedDate: '2025-04-03',
      size: '3.1 MB',
    },
    {
      idSuffix: '3',
      name: 'Color_Palette.png',
      fileType: 'Image',
      trashedDate: '2025-04-03',
      size: '0.9 MB',
    },
  ]),
};

export const getFileTypeFilters = (t: (key: string) => string): FilterOption[] => [
  {
    value: 'Folder',
    label: t('FOLDER'),
  },
  {
    value: 'File',
    label: t('FILE'),
  },
  {
    value: 'Image',
    label: t('IMAGE'),
  },
  {
    value: 'Audio',
    label: t('AUDIO'),
  },
  {
    value: 'Video',
    label: t('VIDEO'),
  },
];
