type FilterOption = {
  value: string;
  label: string;
};

export const getStatusOptions = (t: (key: string) => string): FilterOption[] => [
  {
    value: 'true',
    label: t('ACTIVE'),
  },
  {
    value: 'false',
    label: t('INACTIVE'),
  },
];

export const getMfaEnabledOptions = (t: (key: string) => string): FilterOption[] => [
  {
    value: 'true',
    label: t('ENABLED'),
  },
  {
    value: 'false',
    label: t('DISABLED'),
  },
];
