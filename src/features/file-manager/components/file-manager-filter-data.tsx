type FilterOption = {
  value: string;
  label: string;
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
