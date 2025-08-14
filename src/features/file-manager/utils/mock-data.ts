import { FileType, IFileDataWithSharing, SharedUser } from './file-manager';

const USER_POOL: Record<string, SharedUser> = {
  '1': {
    id: '1',
    name: 'Luca Meier',
    avatar: '/avatars/luca-meier.jpg',
  },
  '2': {
    id: '2',
    name: 'Aaron Green',
    avatar: '/avatars/aaron-green.jpg',
  },
  '3': {
    id: '3',
    name: 'Sarah Pavan',
    avatar: '/avatars/sarah-pavan.jpg',
  },
  '4': {
    id: '4',
    name: 'Adrian Müller',
    avatar: '/avatars/adrian-muller.jpg',
  },
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

interface FolderContentDefinition {
  id: string;
  name: string;
  fileType: FileType;
  lastModified: string;
  size: string;
  isShared: boolean;
  sharedById: string;
  sharedWithIds?: string[];
}

const FOLDER_CONTENTS_DATA: Record<string, FolderContentDefinition[]> = {
  '1': [
    {
      id: '1-1',
      name: 'Weekly_Standup_Notes.doc',
      lastModified: '2025-02-01',
      fileType: 'File',
      size: '2.3 MB',
      isShared: true,
      sharedById: '1',
      sharedWithIds: ['2', '3'],
    },
    {
      id: '1-2',
      name: 'Sprint_Planning.pdf',
      lastModified: '2025-01-28',
      fileType: 'File',
      size: '1.8 MB',
      isShared: true,
      sharedById: '2',
      sharedWithIds: ['2'],
    },
    {
      id: '1-3',
      name: 'Action_Items.xlsx',
      lastModified: '2025-01-25',
      fileType: 'File',
      size: '0.9 MB',
      isShared: false,
      sharedById: '3',
    },
  ],
  '2': [
    {
      id: '2-1',
      name: 'Survey_Results.csv',
      lastModified: '2025-02-02',
      fileType: 'File',
      size: '5.4 MB',
      isShared: true,
      sharedById: '2',
      sharedWithIds: ['1', '4'],
    },
    {
      id: '2-2',
      name: 'Analysis_Report.pdf',
      lastModified: '2025-01-30',
      fileType: 'File',
      size: '3.2 MB',
      isShared: true,
      sharedById: '1',
      sharedWithIds: ['2', '3', '4'],
    },
    {
      id: '2-3',
      name: 'Raw_Data.json',
      lastModified: '2025-01-27',
      fileType: 'File',
      size: '12.1 MB',
      isShared: false,
      sharedById: '4',
    },
  ],
  '3': [
    {
      id: '3-1',
      name: 'Contract_Agreement.pdf',
      lastModified: '2025-02-01',
      fileType: 'File',
      size: '2.7 MB',
      isShared: true,
      sharedById: '3',
      sharedWithIds: ['1', '2'],
    },
    {
      id: '3-2',
      name: 'Client_Proposal.docx',
      lastModified: '2025-01-29',
      fileType: 'File',
      size: '4.1 MB',
      isShared: true,
      sharedById: '1',
      sharedWithIds: ['3', '4'],
    },
    {
      id: '3-3',
      name: 'Requirements_Spec.pdf',
      lastModified: '2025-01-26',
      fileType: 'File',
      size: '6.3 MB',
      isShared: true,
      sharedById: '2',
      sharedWithIds: ['1', '3'],
    },
  ],
  '4': [
    {
      id: '4-1',
      name: 'Architecture_Diagram.png',
      lastModified: '2025-02-01',
      fileType: 'Image',
      size: '3.8 MB',
      isShared: true,
      sharedById: '1',
      sharedWithIds: ['2', '4'],
    },
    {
      id: '4-2',
      name: 'Technical_Specs.md',
      lastModified: '2025-01-31',
      fileType: 'File',
      size: '1.2 MB',
      isShared: true,
      sharedById: '4',
      sharedWithIds: ['1', '2', '3'],
    },
    {
      id: '4-3',
      name: 'Code_Review.pdf',
      lastModified: '2025-01-28',
      fileType: 'File',
      size: '2.9 MB',
      isShared: false,
      sharedById: '3',
    },
  ],
  '5': [
    {
      id: '5-1',
      name: 'Logo_Variations.ai',
      lastModified: '2025-02-02',
      fileType: 'File',
      size: '8.4 MB',
      isShared: true,
      sharedById: '4',
      sharedWithIds: ['1', '3'],
    },
    {
      id: '5-2',
      name: 'UI_Components.sketch',
      lastModified: '2025-01-30',
      fileType: 'File',
      size: '15.7 MB',
      isShared: true,
      sharedById: '3',
      sharedWithIds: ['1', '2', '4'],
    },
    {
      id: '5-3',
      name: 'Color_Palette.png',
      lastModified: '2025-01-27',
      fileType: 'Image',
      size: '1.1 MB',
      isShared: true,
      sharedById: '1',
      sharedWithIds: ['2', '3'],
    },
  ],
  '11': [
    {
      id: '11-1',
      name: 'Campaign_Banner.jpg',
      lastModified: '2025-01-31',
      fileType: 'Image',
      size: '7.2 MB',
      isShared: true,
      sharedById: '4',
      sharedWithIds: ['1', '2'],
    },
    {
      id: '11-2',
      name: 'Social_Media_Kit.zip',
      lastModified: '2025-01-29',
      fileType: 'File',
      size: '23.5 MB',
      isShared: true,
      sharedById: '2',
      sharedWithIds: ['1', '3', '4'],
    },
    {
      id: '11-3',
      name: 'Brand_Guidelines.pdf',
      lastModified: '2025-01-26',
      fileType: 'File',
      size: '9.8 MB',
      isShared: true,
      sharedById: '3',
      sharedWithIds: ['1', '2', '4'],
    },
  ],
};

interface RootFileDefinition {
  id: string;
  name: string;
  fileType: FileType;
  lastModified: string;
  size: string;
  isShared: boolean;
  sharedById: string;
  sharedWithIds?: string[];
}

const ROOT_FILES_DATA: RootFileDefinition[] = [
  {
    id: '1',
    name: 'Meeting Notes',
    lastModified: '2025-02-03',
    fileType: 'Folder',
    size: '21.4 MB',
    isShared: false,
    sharedById: '1',
  },
  {
    id: '2',
    name: 'Research Data',
    lastModified: '2025-02-03',
    fileType: 'Folder',
    size: '21.4 MB',
    isShared: false,
    sharedById: '2',
  },
  {
    id: '3',
    name: 'Client Documents',
    lastModified: '2025-02-03',
    fileType: 'Folder',
    size: '21.4 MB',
    isShared: true,
    sharedById: '3',
    sharedWithIds: ['1', '2', '4'],
  },
  {
    id: '4',
    name: 'Project Files',
    lastModified: '2025-02-03',
    fileType: 'Folder',
    size: '21.4 MB',
    isShared: true,
    sharedById: '1',
    sharedWithIds: ['2', '3'],
  },
  {
    id: '5',
    name: 'Design Assets',
    lastModified: '2025-02-03',
    fileType: 'Folder',
    size: '21.4 MB',
    isShared: true,
    sharedById: '4',
    sharedWithIds: ['1', '2', '3'],
  },
  {
    id: '6',
    name: 'Project Documents.doc',
    lastModified: '2025-02-03',
    fileType: 'File',
    size: '21.4 MB',
    isShared: true,
    sharedById: '3',
    sharedWithIds: ['1', '4'],
  },
  {
    id: '7',
    name: 'Image.jpg',
    lastModified: '2025-02-03',
    fileType: 'Image',
    size: '21.4 MB',
    isShared: false,
    sharedById: '4',
  },
  {
    id: '8',
    name: 'Chill Beats Mix.mp3',
    lastModified: '2025-02-03',
    fileType: 'Audio',
    size: '21.4 MB',
    isShared: true,
    sharedById: '2',
    sharedWithIds: ['1', '3'],
  },
  {
    id: '9',
    name: 'Adventure_Video.mp4',
    lastModified: '2025-02-03',
    fileType: 'Video',
    size: '21.4 MB',
    isShared: true,
    sharedById: '1',
    sharedWithIds: ['2', '3', '4'],
  },
  {
    id: '10',
    name: 'Requirements.doc',
    lastModified: '2025-02-03',
    fileType: 'File',
    size: '21.4 MB',
    isShared: true,
    sharedById: '3',
    sharedWithIds: ['1', '2'],
  },
  {
    id: '11',
    name: 'Marketing Assets',
    lastModified: '2025-02-01',
    fileType: 'Folder',
    size: '45.2 MB',
    isShared: true,
    sharedById: '4',
    sharedWithIds: ['1', '2', '3'],
  },
  {
    id: '12',
    name: 'Budget Spreadsheet.xlsx',
    lastModified: '2025-01-28',
    fileType: 'File',
    size: '2.1 MB',
    isShared: true,
    sharedById: '2',
    sharedWithIds: ['1', '3', '4'],
  },
  {
    id: '13',
    name: 'Team Photo.png',
    lastModified: '2025-01-25',
    fileType: 'Image',
    size: '8.7 MB',
    isShared: true,
    sharedById: '1',
    sharedWithIds: ['2', '4'],
  },
  {
    id: '14',
    name: 'Presentation.pptx',
    lastModified: '2025-01-20',
    fileType: 'File',
    size: '15.3 MB',
    isShared: true,
    sharedById: '3',
    sharedWithIds: ['1', '2', '4'],
  },
  {
    id: '15',
    name: 'Training Video.mp4',
    lastModified: '2025-01-15',
    fileType: 'Video',
    size: '125.8 MB',
    isShared: true,
    sharedById: '4',
    sharedWithIds: ['1', '2', '3'],
  },
];

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
