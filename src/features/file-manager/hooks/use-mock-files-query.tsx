import { useCallback, useEffect, useMemo, useState } from 'react';
import { FileType, IFileDataWithSharing } from '../utils/file-manager';

export interface IFileData {
  id: string;
  name: string;
  lastModified: Date;
  fileType: FileType;
  size: string;
  isShared?: boolean;
  sharedBy?: {
    id: string;
    name: string;
    avatar?: string;
  };
  sharedDate?: Date;
  parentFolderId?: string;
}

export const FILE_BREADCRUMB_TITLES = {
  '/files': 'MY_FILES',
  '/files/1': 'MEETING_NOTES',
  '/files/2': 'RESEARCH_DATA',
  '/files/3': 'CLIENT_DOCUMENTS',
  '/files/4': 'PROJECT_FILES',
  '/files/5': 'DESIGN_ASSETS',
  '/files/11': 'MARKETING_ASSETS',
};

export const filesFolderContents: Record<string, IFileDataWithSharing[]> = {
  '1': [
    {
      id: '1-1',
      name: 'Weekly_Standup_Notes.doc',
      lastModified: new Date('2025-02-01'),
      fileType: 'File',
      size: '2.3 MB',
      isShared: true,
      parentFolderId: '1',
      sharedBy: {
        id: '1',
        name: 'Luca Meier',
        avatar: '/avatars/luca-meier.jpg',
      },
      sharedDate: new Date('2025-02-01'),
      sharedWith: [
        {
          id: '2',
          name: 'Aaron Green',
          avatar: '/avatars/aaron-green.jpg',
        },
        {
          id: '3',
          name: 'Sarah Pavan',
          avatar: '/avatars/sarah-pavan.jpg',
        },
      ],
    },
    {
      id: '1-2',
      name: 'Sprint_Planning.pdf',
      lastModified: new Date('2025-01-28'),
      fileType: 'File',
      size: '1.8 MB',
      isShared: true,
      parentFolderId: '1',
      sharedBy: {
        id: '2',
        name: 'Aaron Green',
        avatar: '/avatars/aaron-green.jpg',
      },
      sharedDate: new Date('2025-01-28'),
      sharedWith: [
        {
          id: '2',
          name: 'Aaron Green',
          avatar: '/avatars/aaron-green.jpg',
        },
      ],
    },
    {
      id: '1-3',
      name: 'Action_Items.xlsx',
      lastModified: new Date('2025-01-25'),
      fileType: 'File',
      size: '0.9 MB',
      isShared: false,
      parentFolderId: '1',
      sharedBy: {
        id: '3',
        name: 'Sarah Pavan',
        avatar: '/avatars/sarah-pavan.jpg',
      },
      sharedDate: new Date('2025-01-25'),
    },
  ],
  '2': [
    // Research Data folder
    {
      id: '2-1',
      name: 'Survey_Results.csv',
      lastModified: new Date('2025-02-02'),
      fileType: 'File',
      size: '5.4 MB',
      isShared: true,
      parentFolderId: '2',
      sharedBy: {
        id: '2',
        name: 'Aaron Green',
        avatar: '/avatars/aaron-green.jpg',
      },
      sharedDate: new Date('2025-02-02'),
      sharedWith: [
        {
          id: '1',
          name: 'Luca Meier',
          avatar: '/avatars/luca-meier.jpg',
        },
        {
          id: '4',
          name: 'Adrian Müller',
          avatar: '/avatars/adrian-muller.jpg',
        },
      ],
    },
    {
      id: '2-2',
      name: 'Analysis_Report.pdf',
      lastModified: new Date('2025-01-30'),
      fileType: 'File',
      size: '3.2 MB',
      isShared: true,
      parentFolderId: '2',
      sharedBy: {
        id: '1',
        name: 'Luca Meier',
        avatar: '/avatars/luca-meier.jpg',
      },
      sharedDate: new Date('2025-01-30'),
      sharedWith: [
        {
          id: '2',
          name: 'Aaron Green',
          avatar: '/avatars/aaron-green.jpg',
        },
        {
          id: '3',
          name: 'Sarah Pavan',
          avatar: '/avatars/sarah-pavan.jpg',
        },
        {
          id: '4',
          name: 'Adrian Müller',
          avatar: '/avatars/adrian-muller.jpg',
        },
      ],
    },
    {
      id: '2-3',
      name: 'Raw_Data.json',
      lastModified: new Date('2025-01-27'),
      fileType: 'File',
      size: '12.1 MB',
      isShared: false,
      parentFolderId: '2',
      sharedBy: {
        id: '4',
        name: 'Adrian Müller',
        avatar: '/avatars/adrian-muller.jpg',
      },
      sharedDate: new Date('2025-01-27'),
    },
  ],
  '3': [
    {
      id: '3-1',
      name: 'Contract_Agreement.pdf',
      lastModified: new Date('2025-02-01'),
      fileType: 'File',
      size: '2.7 MB',
      isShared: true,
      parentFolderId: '3',
      sharedBy: {
        id: '3',
        name: 'Sarah Pavan',
        avatar: '/avatars/sarah-pavan.jpg',
      },
      sharedDate: new Date('2025-02-01'),
      sharedWith: [
        {
          id: '1',
          name: 'Luca Meier',
          avatar: '/avatars/luca-meier.jpg',
        },
        {
          id: '2',
          name: 'Aaron Green',
          avatar: '/avatars/aaron-green.jpg',
        },
      ],
    },
    {
      id: '3-2',
      name: 'Client_Proposal.docx',
      lastModified: new Date('2025-01-29'),
      fileType: 'File',
      size: '4.1 MB',
      isShared: true,
      parentFolderId: '3',
      sharedBy: {
        id: '1',
        name: 'Luca Meier',
        avatar: '/avatars/luca-meier.jpg',
      },
      sharedDate: new Date('2025-01-29'),
      sharedWith: [
        {
          id: '3',
          name: 'Sarah Pavan',
          avatar: '/avatars/sarah-pavan.jpg',
        },
        {
          id: '4',
          name: 'Adrian Müller',
          avatar: '/avatars/adrian-muller.jpg',
        },
      ],
    },
    {
      id: '3-3',
      name: 'Requirements_Spec.pdf',
      lastModified: new Date('2025-01-26'),
      fileType: 'File',
      size: '6.3 MB',
      isShared: true,
      parentFolderId: '3',
      sharedBy: {
        id: '2',
        name: 'Aaron Green',
        avatar: '/avatars/aaron-green.jpg',
      },
      sharedDate: new Date('2025-01-26'),
      sharedWith: [
        {
          id: '1',
          name: 'Luca Meier',
          avatar: '/avatars/luca-meier.jpg',
        },
        {
          id: '3',
          name: 'Sarah Pavan',
          avatar: '/avatars/sarah-pavan.jpg',
        },
      ],
    },
  ],
  '4': [
    {
      id: '4-1',
      name: 'Architecture_Diagram.png',
      lastModified: new Date('2025-02-01'),
      fileType: 'Image',
      size: '3.8 MB',
      isShared: true,
      parentFolderId: '4',
      sharedBy: {
        id: '1',
        name: 'Luca Meier',
        avatar: '/avatars/luca-meier.jpg',
      },
      sharedDate: new Date('2025-02-01'),
      sharedWith: [
        {
          id: '2',
          name: 'Aaron Green',
          avatar: '/avatars/aaron-green.jpg',
        },
        {
          id: '4',
          name: 'Adrian Müller',
          avatar: '/avatars/adrian-muller.jpg',
        },
      ],
    },
    {
      id: '4-2',
      name: 'Technical_Specs.md',
      lastModified: new Date('2025-01-31'),
      fileType: 'File',
      size: '1.2 MB',
      isShared: true,
      parentFolderId: '4',
      sharedBy: {
        id: '4',
        name: 'Adrian Müller',
        avatar: '/avatars/adrian-muller.jpg',
      },
      sharedDate: new Date('2025-01-31'),
      sharedWith: [
        {
          id: '1',
          name: 'Luca Meier',
          avatar: '/avatars/luca-meier.jpg',
        },
        {
          id: '2',
          name: 'Aaron Green',
          avatar: '/avatars/aaron-green.jpg',
        },
        {
          id: '3',
          name: 'Sarah Pavan',
          avatar: '/avatars/sarah-pavan.jpg',
        },
      ],
    },
    {
      id: '4-3',
      name: 'Code_Review.pdf',
      lastModified: new Date('2025-01-28'),
      fileType: 'File',
      size: '2.9 MB',
      isShared: false,
      parentFolderId: '4',
      sharedBy: {
        id: '3',
        name: 'Sarah Pavan',
        avatar: '/avatars/sarah-pavan.jpg',
      },
      sharedDate: new Date('2025-01-28'),
    },
  ],
  '5': [
    {
      id: '5-1',
      name: 'Logo_Variations.ai',
      lastModified: new Date('2025-02-02'),
      fileType: 'File',
      size: '8.4 MB',
      isShared: true,
      parentFolderId: '5',
      sharedBy: {
        id: '4',
        name: 'Adrian Müller',
        avatar: '/avatars/adrian-muller.jpg',
      },
      sharedDate: new Date('2025-02-02'),
      sharedWith: [
        {
          id: '1',
          name: 'Luca Meier',
          avatar: '/avatars/luca-meier.jpg',
        },
        {
          id: '3',
          name: 'Sarah Pavan',
          avatar: '/avatars/sarah-pavan.jpg',
        },
      ],
    },
    {
      id: '5-2',
      name: 'UI_Components.sketch',
      lastModified: new Date('2025-01-30'),
      fileType: 'File',
      size: '15.7 MB',
      isShared: true,
      parentFolderId: '5',
      sharedBy: {
        id: '3',
        name: 'Sarah Pavan',
        avatar: '/avatars/sarah-pavan.jpg',
      },
      sharedDate: new Date('2025-01-30'),
      sharedWith: [
        {
          id: '1',
          name: 'Luca Meier',
          avatar: '/avatars/luca-meier.jpg',
        },
        {
          id: '2',
          name: 'Aaron Green',
          avatar: '/avatars/aaron-green.jpg',
        },
        {
          id: '4',
          name: 'Adrian Müller',
          avatar: '/avatars/adrian-muller.jpg',
        },
      ],
    },
    {
      id: '5-3',
      name: 'Color_Palette.png',
      lastModified: new Date('2025-01-27'),
      fileType: 'Image',
      size: '1.1 MB',
      isShared: true,
      parentFolderId: '5',
      sharedBy: {
        id: '1',
        name: 'Luca Meier',
        avatar: '/avatars/luca-meier.jpg',
      },
      sharedDate: new Date('2025-01-27'),
      sharedWith: [
        {
          id: '2',
          name: 'Aaron Green',
          avatar: '/avatars/aaron-green.jpg',
        },
        {
          id: '3',
          name: 'Sarah Pavan',
          avatar: '/avatars/sarah-pavan.jpg',
        },
      ],
    },
  ],
  '11': [
    {
      id: '11-1',
      name: 'Campaign_Banner.jpg',
      lastModified: new Date('2025-01-31'),
      fileType: 'Image',
      size: '7.2 MB',
      isShared: true,
      parentFolderId: '11',
      sharedBy: {
        id: '4',
        name: 'Adrian Müller',
        avatar: '/avatars/adrian-muller.jpg',
      },
      sharedDate: new Date('2025-01-31'),
      sharedWith: [
        {
          id: '1',
          name: 'Luca Meier',
          avatar: '/avatars/luca-meier.jpg',
        },
        {
          id: '2',
          name: 'Aaron Green',
          avatar: '/avatars/aaron-green.jpg',
        },
      ],
    },
    {
      id: '11-2',
      name: 'Social_Media_Kit.zip',
      lastModified: new Date('2025-01-29'),
      fileType: 'File',
      size: '23.5 MB',
      isShared: true,
      parentFolderId: '11',
      sharedBy: {
        id: '2',
        name: 'Aaron Green',
        avatar: '/avatars/aaron-green.jpg',
      },
      sharedDate: new Date('2025-01-29'),
      sharedWith: [
        {
          id: '1',
          name: 'Luca Meier',
          avatar: '/avatars/luca-meier.jpg',
        },
        {
          id: '3',
          name: 'Sarah Pavan',
          avatar: '/avatars/sarah-pavan.jpg',
        },
        {
          id: '4',
          name: 'Adrian Müller',
          avatar: '/avatars/adrian-muller.jpg',
        },
      ],
    },
    {
      id: '11-3',
      name: 'Brand_Guidelines.pdf',
      lastModified: new Date('2025-01-26'),
      fileType: 'File',
      size: '9.8 MB',
      isShared: true,
      parentFolderId: '11',
      sharedBy: {
        id: '3',
        name: 'Sarah Pavan',
        avatar: '/avatars/sarah-pavan.jpg',
      },
      sharedDate: new Date('2025-01-26'),
      sharedWith: [
        {
          id: '1',
          name: 'Luca Meier',
          avatar: '/avatars/luca-meier.jpg',
        },
        {
          id: '2',
          name: 'Aaron Green',
          avatar: '/avatars/aaron-green.jpg',
        },
        {
          id: '4',
          name: 'Adrian Müller',
          avatar: '/avatars/adrian-muller.jpg',
        },
      ],
    },
  ],
};

export const mockFileData: IFileDataWithSharing[] = [
  {
    id: '1',
    name: 'Meeting Notes',
    lastModified: new Date('2025-02-03'),
    fileType: 'Folder',
    size: '21.4 MB',
    isShared: false,
    sharedBy: {
      id: '1',
      name: 'Luca Meier',
      avatar: '/avatars/luca-meier.jpg',
    },
    sharedDate: new Date('2025-02-03'),
  },
  {
    id: '2',
    name: 'Research Data',
    lastModified: new Date('2025-02-03'),
    fileType: 'Folder',
    size: '21.4 MB',
    isShared: false,
    sharedBy: {
      id: '2',
      name: 'Aaron Green',
      avatar: '/avatars/aaron-green.jpg',
    },
    sharedDate: new Date('2025-02-03'),
  },
  {
    id: '3',
    name: 'Client Documents',
    lastModified: new Date('2025-02-03'),
    fileType: 'Folder',
    size: '21.4 MB',
    isShared: true,
    sharedBy: {
      id: '3',
      name: 'Sarah Pavan',
      avatar: '/avatars/sarah-pavan.jpg',
    },
    sharedDate: new Date('2025-02-03'),
    sharedWith: [
      {
        id: '1',
        name: 'Luca Meier',
        avatar: '/avatars/luca-meier.jpg',
      },
      {
        id: '2',
        name: 'Aaron Green',
        avatar: '/avatars/aaron-green.jpg',
      },
      {
        id: '4',
        name: 'Adrian Müller',
        avatar: '/avatars/adrian-muller.jpg',
      },
    ],
  },
  {
    id: '4',
    name: 'Project Files',
    lastModified: new Date('2025-02-03'),
    fileType: 'Folder',
    size: '21.4 MB',
    isShared: true,
    sharedBy: {
      id: '1',
      name: 'Luca Meier',
      avatar: '/avatars/luca-meier.jpg',
    },
    sharedDate: new Date('2025-02-03'),
    sharedWith: [
      {
        id: '2',
        name: 'Aaron Green',
        avatar: '/avatars/aaron-green.jpg',
      },
      {
        id: '3',
        name: 'Sarah Pavan',
        avatar: '/avatars/sarah-pavan.jpg',
      },
    ],
  },
  {
    id: '5',
    name: 'Design Assets',
    lastModified: new Date('2025-02-03'),
    fileType: 'Folder',
    size: '21.4 MB',
    isShared: true,
    sharedBy: {
      id: '4',
      name: 'Adrian Müller',
      avatar: '/avatars/adrian-muller.jpg',
    },
    sharedDate: new Date('2025-02-03'),
    sharedWith: [
      {
        id: '1',
        name: 'Luca Meier',
        avatar: '/avatars/luca-meier.jpg',
      },
      {
        id: '2',
        name: 'Aaron Green',
        avatar: '/avatars/aaron-green.jpg',
      },
      {
        id: '3',
        name: 'Sarah Pavan',
        avatar: '/avatars/sarah-pavan.jpg',
      },
    ],
  },
  {
    id: '6',
    name: 'Project Documents.doc',
    lastModified: new Date('2025-02-03'),
    fileType: 'File',
    size: '21.4 MB',
    isShared: true,
    sharedBy: {
      id: '3',
      name: 'Sarah Pavan',
      avatar: '/avatars/sarah-pavan.jpg',
    },
    sharedDate: new Date('2025-02-03'),
    sharedWith: [
      {
        id: '1',
        name: 'Luca Meier',
        avatar: '/avatars/luca-meier.jpg',
      },
      {
        id: '4',
        name: 'Adrian Müller',
        avatar: '/avatars/adrian-muller.jpg',
      },
    ],
  },
  {
    id: '7',
    name: 'Image.jpg',
    lastModified: new Date('2025-02-03'),
    fileType: 'Image',
    size: '21.4 MB',
    isShared: false,
    sharedBy: {
      id: '4',
      name: 'Adrian Müller',
      avatar: '/avatars/adrian-muller.jpg',
    },
    sharedDate: new Date('2025-02-03'),
  },
  {
    id: '8',
    name: 'Chill Beats Mix.mp3',
    lastModified: new Date('2025-02-03'),
    fileType: 'Audio',
    size: '21.4 MB',
    isShared: true,
    sharedBy: {
      id: '2',
      name: 'Aaron Green',
      avatar: '/avatars/aaron-green.jpg',
    },
    sharedDate: new Date('2025-02-03'),
    sharedWith: [
      {
        id: '1',
        name: 'Luca Meier',
        avatar: '/avatars/luca-meier.jpg',
      },
      {
        id: '3',
        name: 'Sarah Pavan',
        avatar: '/avatars/sarah-pavan.jpg',
      },
    ],
  },
  {
    id: '9',
    name: 'Adventure_Video.mp4',
    lastModified: new Date('2025-02-03'),
    fileType: 'Video',
    size: '21.4 MB',
    isShared: true,
    sharedBy: {
      id: '1',
      name: 'Luca Meier',
      avatar: '/avatars/luca-meier.jpg',
    },
    sharedDate: new Date('2025-02-03'),
    sharedWith: [
      {
        id: '2',
        name: 'Aaron Green',
        avatar: '/avatars/aaron-green.jpg',
      },
      {
        id: '3',
        name: 'Sarah Pavan',
        avatar: '/avatars/sarah-pavan.jpg',
      },
      {
        id: '4',
        name: 'Adrian Müller',
        avatar: '/avatars/adrian-muller.jpg',
      },
    ],
  },
  {
    id: '10',
    name: 'Requirements.doc',
    lastModified: new Date('2025-02-03'),
    fileType: 'File',
    size: '21.4 MB',
    isShared: true,
    sharedBy: {
      id: '3',
      name: 'Sarah Pavan',
      avatar: '/avatars/sarah-pavan.jpg',
    },
    sharedDate: new Date('2025-02-03'),
    sharedWith: [
      {
        id: '1',
        name: 'Luca Meier',
        avatar: '/avatars/luca-meier.jpg',
      },
      {
        id: '2',
        name: 'Aaron Green',
        avatar: '/avatars/aaron-green.jpg',
      },
    ],
  },
  {
    id: '11',
    name: 'Marketing Assets',
    lastModified: new Date('2025-02-01'),
    fileType: 'Folder',
    size: '45.2 MB',
    isShared: true,
    sharedBy: {
      id: '4',
      name: 'Adrian Müller',
      avatar: '/avatars/adrian-muller.jpg',
    },
    sharedDate: new Date('2025-02-01'),
    sharedWith: [
      {
        id: '1',
        name: 'Luca Meier',
        avatar: '/avatars/luca-meier.jpg',
      },
      {
        id: '2',
        name: 'Aaron Green',
        avatar: '/avatars/aaron-green.jpg',
      },
      {
        id: '3',
        name: 'Sarah Pavan',
        avatar: '/avatars/sarah-pavan.jpg',
      },
    ],
  },
  {
    id: '12',
    name: 'Budget Spreadsheet.xlsx',
    lastModified: new Date('2025-01-28'),
    fileType: 'File',
    size: '2.1 MB',
    isShared: true,
    sharedBy: {
      id: '2',
      name: 'Aaron Green',
      avatar: '/avatars/aaron-green.jpg',
    },
    sharedDate: new Date('2025-01-28'),
    sharedWith: [
      {
        id: '1',
        name: 'Luca Meier',
        avatar: '/avatars/luca-meier.jpg',
      },
      {
        id: '3',
        name: 'Sarah Pavan',
        avatar: '/avatars/sarah-pavan.jpg',
      },
      {
        id: '4',
        name: 'Adrian Müller',
        avatar: '/avatars/adrian-muller.jpg',
      },
    ],
  },
  {
    id: '13',
    name: 'Team Photo.png',
    lastModified: new Date('2025-01-25'),
    fileType: 'Image',
    size: '8.7 MB',
    isShared: true,
    sharedBy: {
      id: '1',
      name: 'Luca Meier',
      avatar: '/avatars/luca-meier.jpg',
    },
    sharedDate: new Date('2025-01-25'),
    sharedWith: [
      {
        id: '2',
        name: 'Aaron Green',
        avatar: '/avatars/aaron-green.jpg',
      },
      {
        id: '4',
        name: 'Adrian Müller',
        avatar: '/avatars/adrian-muller.jpg',
      },
    ],
  },
  {
    id: '14',
    name: 'Presentation.pptx',
    lastModified: new Date('2025-01-20'),
    fileType: 'File',
    size: '15.3 MB',
    isShared: true,
    sharedBy: {
      id: '3',
      name: 'Sarah Pavan',
      avatar: '/avatars/sarah-pavan.jpg',
    },
    sharedDate: new Date('2025-01-20'),
    sharedWith: [
      {
        id: '1',
        name: 'Luca Meier',
        avatar: '/avatars/luca-meier.jpg',
      },
      {
        id: '2',
        name: 'Aaron Green',
        avatar: '/avatars/aaron-green.jpg',
      },
      {
        id: '4',
        name: 'Adrian Müller',
        avatar: '/avatars/adrian-muller.jpg',
      },
    ],
  },
  {
    id: '15',
    name: 'Training Video.mp4',
    lastModified: new Date('2025-01-15'),
    fileType: 'Video',
    size: '125.8 MB',
    isShared: true,
    sharedBy: {
      id: '4',
      name: 'Adrian Müller',
      avatar: '/avatars/adrian-muller.jpg',
    },
    sharedDate: new Date('2025-01-15'),
    sharedWith: [
      {
        id: '1',
        name: 'Luca Meier',
        avatar: '/avatars/luca-meier.jpg',
      },
      {
        id: '2',
        name: 'Aaron Green',
        avatar: '/avatars/aaron-green.jpg',
      },
      {
        id: '3',
        name: 'Sarah Pavan',
        avatar: '/avatars/sarah-pavan.jpg',
      },
    ],
  },
];

interface QueryParams {
  filter: {
    name?: string;
    fileType?: FileType;
    lastModified?: {
      from?: Date;
      to?: Date;
    };
  };
  page: number;
  pageSize: number;
  folderId?: string;
}

export const useMockFilesQuery = (queryParams: QueryParams) => {
  const [data, setData] = useState<null | { data: IFileDataWithSharing[]; totalCount: number }>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const memoizedQueryParams = useMemo(
    () => ({
      page: queryParams.page,
      pageSize: queryParams.pageSize,
      filterName: queryParams.filter.name ?? '',
      filterFileType: queryParams.filter.fileType ?? '',
      filterLastModified: queryParams.filter.lastModified,
      folderId: queryParams.folderId,
    }),
    [
      queryParams.page,
      queryParams.pageSize,
      queryParams.filter.name,
      queryParams.filter.fileType,
      queryParams.filter.lastModified,
      queryParams.folderId,
    ]
  );

  const refetch = useCallback(() => {
    setIsLoading(true);
    setError(null);
  }, []);

  const filterData = useCallback((data: IFileData[], params: typeof memoizedQueryParams) => {
    let filteredData = [...data];

    if (params.filterName) {
      filteredData = filteredData.filter((file) =>
        file.name.toLowerCase().includes(params.filterName.toLowerCase())
      );
    }

    if (params.filterFileType) {
      filteredData = filteredData.filter((file) => file.fileType === params.filterFileType);
    }

    if (params.filterLastModified?.from || params.filterLastModified?.to) {
      filteredData = filteredData.filter((file) => {
        const lastModified = file.lastModified;
        if (!lastModified) return false;

        if (params.filterLastModified?.from && lastModified < params.filterLastModified.from) {
          return false;
        }

        if (params.filterLastModified?.to) {
          const endOfDay = new Date(params.filterLastModified.to);
          endOfDay.setHours(23, 59, 59, 999);
          if (lastModified > endOfDay) {
            return false;
          }
        }

        return true;
      });
    }

    return filteredData;
  }, []);

  const paginateData = useCallback((data: IFileData[], params: typeof memoizedQueryParams) => {
    const startIndex = params.page * params.pageSize;
    const endIndex = startIndex + params.pageSize;
    return data.slice(startIndex, endIndex);
  }, []);

  const areItemsEqual = useCallback((item1: any, item2: any): boolean => {
    if (!item2) return false;

    return (
      item1.id === item2.id &&
      item1.name === item2.name &&
      item1.lastModified?.getTime() === item2.lastModified?.getTime()
    );
  }, []);

  const isDataEqual = useCallback(
    (prevData: any, newData: any) => {
      if (!prevData) return false;

      if (prevData.totalCount !== newData.totalCount) return false;
      if (prevData.data.length !== newData.data.length) return false;

      return prevData.data.every((item: any, index: number) =>
        areItemsEqual(item, newData.data[index])
      );
    },
    [areItemsEqual]
  );

  const processData = useCallback(() => {
    let sourceData: IFileData[];

    if (memoizedQueryParams.folderId && filesFolderContents[memoizedQueryParams.folderId]) {
      sourceData = [...filesFolderContents[memoizedQueryParams.folderId]];
    } else {
      sourceData = [...mockFileData];
    }

    const filteredData = filterData(sourceData, memoizedQueryParams);
    const paginatedData = paginateData(filteredData, memoizedQueryParams);

    return {
      data: paginatedData,
      totalCount: filteredData.length,
    };
  }, [filterData, paginateData, memoizedQueryParams]);

  const handleError = useCallback((err: unknown) => {
    if (err instanceof Error) {
      setError(err.message);
    } else {
      setError('An unexpected error occurred');
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    const timer = setTimeout(() => {
      try {
        const newData = processData();

        setData((prevData) => {
          if (isDataEqual(prevData, newData)) {
            return prevData;
          }
          return newData;
        });

        setIsLoading(false);
      } catch (err) {
        handleError(err);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [memoizedQueryParams, refetch, processData, isDataEqual, handleError]);

  return { data, isLoading, error, refetch };
};
